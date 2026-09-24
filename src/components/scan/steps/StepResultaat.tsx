import { content } from '../../../content'
import type { EvaluateResult } from '../../../engine/types'
import { renderApa } from '../../../utils/renderApa'

const instrumentById = Object.fromEntries(
  content.instruments.instruments.map((i) => [i.id, i]),
)

function collectSourceIds(result: EvaluateResult): string[] {
  const ids = new Set<string>()
  for (const p of result.priorities) p.sourceIds.forEach((id) => ids.add(id))
  content.rules.rules.forEach((r) => r.sourceIds.forEach((id) => ids.add(id)))
  return [...ids].sort()
}

export function StepResultaat({ result }: { result: EvaluateResult }) {
  const ui = content.ui.resultPlaceholder
  const sourceIds = collectSourceIds(result)
  const sources = sourceIds
    .map((id) => content.sources.sources.find((s) => s.id === id))
    .filter(Boolean)

  const ethicsByInstrument = new Map(result.ethicsNotes.map((n) => [n.instrumentId, n.note]))

  return (
    <div className="space-y-6 text-sm">
      <p className="text-muted">{ui.intro}</p>

      {result.sufficient && result.sufficientText && (
        <p className="rounded-lg border border-line bg-bg2 p-4 text-ink">{result.sufficientText}</p>
      )}

      {result.priorities.length > 0 && (
        <section>
          <h3 className="font-heading text-base font-bold text-ink">{ui.prioritiesTitle}</h3>
          <ul className="mt-3 space-y-4">
            {result.priorities.map((p) => {
              const inst = instrumentById[p.instrumentId]
              const ethics = ethicsByInstrument.get(p.instrumentId)
              return (
                <li key={`${p.instrumentId}-${p.rule}`} className="rounded-xl border border-line bg-bg2 p-4">
                  <p className="text-xs font-bold uppercase text-accent">{p.kind} · {p.horizon}</p>
                  <p className="mt-1 font-semibold text-ink">{inst?.label ?? p.instrumentId}</p>
                  <p className="mt-2 text-muted">{p.why}</p>
                  <p className="mt-2 text-ink">{p.firstStep}</p>
                  {p.formSentence && <p className="mt-2 text-ink">{p.formSentence}</p>}
                  {ethics && (
                    <p className="mt-2 border-l-2 border-ethiek pl-3 text-ink">{ethics}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {result.temporary.length > 0 && (
        <section>
          <h3 className="font-heading text-base font-bold text-ink">{ui.temporaryTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {result.temporary.map((t) => (
              <li key={t.instrumentId}>
                {instrumentById[t.instrumentId]?.label ?? t.instrumentId}: {t.why}
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.external.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-muted">
          {result.external.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {result.signals.length > 0 && (
        <section>
          <h3 className="font-heading text-base font-bold text-ink">{ui.signalsTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {result.signals.map((s, i) => (
              <li key={`${s.id}-${i}`}>{s.text}</li>
            ))}
          </ul>
        </section>
      )}

      {result.ethicsNotes.length > 0 && (
        <section>
          <h3 className="font-heading text-base font-bold text-ink">{ui.ethicsTitle}</h3>
          <ul className="mt-2 space-y-2">
            {result.ethicsNotes.map((n) => (
              <li key={n.mmvId} className="text-muted">
                <strong className="text-ink">{instrumentById[n.instrumentId]?.label}</strong>: {n.note}
              </li>
            ))}
          </ul>
        </section>
      )}

      {sources.length > 0 && (
        <section>
          <h3 className="font-heading text-base font-bold text-ink">{ui.sourcesTitle}</h3>
          <ul className="mt-2 space-y-2 text-xs text-muted">
            {sources.map((s) => (
              <li key={s!.id}>{renderApa(s!.apa)}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted">{content.rules.texts.disclaimer}</p>
    </div>
  )
}
