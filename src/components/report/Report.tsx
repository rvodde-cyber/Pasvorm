import { useCallback } from 'react'
import { content } from '../../content'
import { quadrantLabel } from '../../engine/culture'
import { phaseName } from '../../engine/phase'
import type { BundleId, EvaluateResult, QuadrantId } from '../../engine/types'
import type { ScanSession } from '../../scan/types'
import { renderApa } from '../../utils/renderApa'
import { collectReportSourceIds } from './collectSources'
import {
  fillTemplate,
  formatDecimal,
  formatPercent,
  reportDateIso,
  reportDateLong,
} from './reportFormat'

const instrumentById = Object.fromEntries(
  content.instruments.instruments.map((i) => [i.id, i]),
)

const bundleById = Object.fromEntries(content.bundles.bundles.map((b) => [b.id, b]))

const QUADRANT_ORDER: QuadrantId[] = ['clan', 'adhocracy', 'market', 'hierarchy']

const MMV_COLOR_CLASS: Record<string, string> = {
  zien: 'bg-mmv-zien',
  voelen: 'bg-mmv-voelen',
  wegen: 'bg-mmv-wegen',
  handelen: 'bg-mmv-handelen',
  volhouden: 'bg-mmv-volhouden',
}

const QUADRANT_BG: Record<QuadrantId, string> = {
  clan: 'bg-clan',
  adhocracy: 'bg-adhocracy',
  market: 'bg-market',
  hierarchy: 'bg-hierarchy',
}

function ScaleBar({
  value,
  max,
  marker,
  fillClass,
}: {
  value: number
  max: number
  marker?: number
  fillClass: string
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const markerPct = marker != null && max > 0 ? Math.min(100, (marker / max) * 100) : undefined
  return (
    <div className="report-bar-track" aria-hidden>
      <div className={`report-bar-fill ${fillClass}`} style={{ width: `${pct}%` }} />
      {markerPct != null && (
        <div className="report-bar-marker" style={{ left: `${markerPct}%` }} />
      )}
    </div>
  )
}

export function Report({
  result,
  session,
}: {
  result: EvaluateResult
  session: ScanSession
}) {
  const ui = content.ui.report
  const date = reportDateLong()
  const org =
    session.orgName.trim() || ui.orgFallback
  const size = typeof session.size === 'number' ? session.size : 0
  const meta = fillTemplate(ui.meta, {
    org,
    size: String(size),
    date,
  })

  const futureOpt = content.context.future.options.find((o) => o.id === session.future)
  const workforceOpt = content.context.workforce.options.find((o) => o.id === session.workforce)

  const phaseLabel = result.phase.transition
    ? fillTemplate(ui.summary.transition, {
        phase: phaseName(result.phase.dominant),
        nextPhase: phaseName(result.phase.second),
      })
    : phaseName(result.phase.dominant)

  const cultureSummary = result.culture.flat
    ? ui.summary.flat
    : quadrantLabel(result.culture.dominant)

  const nextStepSummary =
    result.priorities.length > 0
      ? `${instrumentById[result.priorities[0].instrumentId]?.label ?? ''}: ${result.priorities[0].firstStep}`
      : ui.summary.sufficientStep

  const sourceIds = collectReportSourceIds(result)
  const sources = sourceIds
    .map((id) => content.sources.sources.find((s) => s.id === id))
    .filter(Boolean)

  const ethicsByInstrument = new Map(result.ethicsNotes.map((n) => [n.instrumentId, n.note]))

  const handlePrint = useCallback(() => {
    const previous = document.title
    const titleOrg = session.orgName.trim() || ui.orgFallback
    document.title = `Pasvorm-rapport – ${titleOrg} – ${reportDateIso()}`
    const restore = () => {
      document.title = previous
      window.removeEventListener('afterprint', restore)
    }
    window.addEventListener('afterprint', restore)
    window.print()
  }, [session.orgName, ui.orgFallback])

  const bundleOrder = content.bundles.bundles.map((b) => b.id as BundleId)

  return (
    <article id="rapport" className="space-y-8 text-sm">
      <header className="space-y-3">
        <h1 className="font-heading text-2xl font-extrabold text-ink md:text-3xl">{ui.title}</h1>
        <p className="text-muted">{meta}</p>
        <p className="leading-relaxed text-ink">{ui.intro}</p>
        <p className="text-xs text-muted">{ui.privacy}</p>
        <figure className="no-print overflow-hidden rounded-xl">
          <img
            src="/images/rapport-meetlint.webp"
            alt=""
            className="h-40 w-full object-cover"
          />
        </figure>
      </header>

      <section className="report-card space-y-3 rounded-xl border border-line bg-bg2 p-4">
        <h2 className="font-heading text-base font-bold text-ink">{ui.summary.title}</h2>
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{ui.summary.phase}</dt>
            <dd className="text-ink">{phaseLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{ui.summary.culture}</dt>
            <dd className="text-ink">{cultureSummary}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{ui.summary.future}</dt>
            <dd className="text-ink">{futureOpt?.title ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{ui.summary.workforce}</dt>
            <dd className="text-ink">{workforceOpt?.title ?? '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{ui.summary.nextStep}</dt>
            <dd className="text-ink">{nextStepSummary}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-base font-bold text-ink">{ui.fit.title}</h2>
        <p className="text-muted">{ui.fit.intro}</p>
        <ul className="space-y-4">
          {bundleOrder.map((bundleId) => {
            const bundle = bundleById[bundleId]
            const fit = result.bundleFit[bundleId]
            const statusLabel = ui.fit.status[fit.status]
            const reasonText = fit.reason ? ui.fit.reasons[fit.reason] : null
            return (
              <li key={bundleId} className="report-card rounded-xl border border-line bg-bg2 p-4">
                <p className="font-semibold text-ink">
                  {bundle.label}
                  <span className="font-normal text-muted"> · {bundle.subtitle}</span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {ui.fit.measured}: {formatDecimal(fit.measured)} · {ui.fit.expected}:{' '}
                  {formatDecimal(fit.expected)} · {statusLabel}
                  {reasonText ? ` — ${reasonText}` : ''}
                </p>
                <div className="mt-2">
                  <ScaleBar
                    value={fit.measured}
                    max={3}
                    marker={fit.expected}
                    fillClass="bg-accent"
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {result.sufficient && result.sufficientText && (
        <p className="report-card rounded-lg border border-line bg-bg2 p-4 text-ink">{result.sufficientText}</p>
      )}

      {result.priorities.length > 0 && (
        <section>
          <h2 className="font-heading text-base font-bold text-ink">{ui.prioritiesTitle}</h2>
          <ul className="mt-3 space-y-4">
            {result.priorities.map((p) => {
              const inst = instrumentById[p.instrumentId]
              const ethics = ethicsByInstrument.get(p.instrumentId)
              return (
                <li
                  key={`${p.instrumentId}-${p.rule}`}
                  className="report-card rounded-xl border border-line bg-bg2 p-4"
                >
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
          <h2 className="font-heading text-base font-bold text-ink">{ui.temporaryTitle}</h2>
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

      {result.workforceNote && (
        <section>
          <h2 className="font-heading text-base font-bold text-ink">{ui.workforceTitle}</h2>
          <p className="mt-2 text-muted">{result.workforceNote}</p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-base font-bold text-ink">{ui.culture.title}</h2>
        <p className="text-muted">{ui.culture.intro}</p>
        <ul className="space-y-3">
          {QUADRANT_ORDER.map((q) => {
            const value = result.culture.profile[q]
            const isDominant = result.culture.dominants.includes(q) && !result.culture.flat
            const hint = ui.culture.hints[q]
            const label = quadrantLabel(q)
            return (
              <li key={q} className="report-card rounded-xl border border-line bg-bg2 p-3">
                <p className="text-ink">
                  <span className="font-semibold">{label}</span>
                  {isDominant && (
                    <span className="ml-2 text-xs font-bold uppercase text-accent">
                      {ui.culture.dominant}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">{hint}</p>
                <p className="mt-1 text-xs text-muted">{formatPercent(value)}%</p>
                <div className="mt-2">
                  <ScaleBar value={value} max={100} fillClass={QUADRANT_BG[q]} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-base font-bold text-ink">{ui.mmv.title}</h2>
        <p className="text-muted">{ui.mmv.intro}</p>
        <ul className="space-y-3">
          {content.mmv.items.map((item) => {
            const score = result.mmvScores[item.id as keyof typeof result.mmvScores]
            const low = score <= content.mmv.lowThreshold
            const colorClass = MMV_COLOR_CLASS[item.color] ?? 'bg-primary'
            return (
              <li key={item.id} className="report-card rounded-xl border border-line bg-bg2 p-3">
                <p className="font-semibold text-ink">
                  {item.phase}
                  {low && (
                    <span className="ml-2 text-xs font-bold text-market"> · {ui.mmv.low}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted">{item.statement}</p>
                <p className="mt-1 text-xs text-muted">
                  Score: {score} / {content.mmv.scale.max}
                </p>
                <div className="mt-2">
                  <ScaleBar value={score - 1} max={4} fillClass={colorClass} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {result.signals.length > 0 && (
        <section>
          <h2 className="font-heading text-base font-bold text-ink">{ui.signalsTitle}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {result.signals.map((s, i) => (
              <li key={`${s.id}-${i}`}>{s.text}</li>
            ))}
          </ul>
        </section>
      )}

      {result.ethicsNotes.length > 0 && (
        <section>
          <h2 className="font-heading text-base font-bold text-ink">{ui.ethicsTitle}</h2>
          <ul className="mt-2 space-y-2">
            {result.ethicsNotes.map((n) => (
              <li key={n.mmvId} className="text-muted">
                <strong className="text-ink">{instrumentById[n.instrumentId]?.label}</strong>: {n.note}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="font-heading text-base font-bold text-ink">{ui.method.title}</h2>
        {ui.method.paragraphs.map((para) => (
          <p key={para.slice(0, 24)} className="text-muted leading-relaxed">{para}</p>
        ))}
      </section>

      {sources.length > 0 && (
        <section>
          <h2 className="font-heading text-base font-bold text-ink">{ui.sourcesTitle}</h2>
          <ul className="mt-2 space-y-2 text-xs text-muted">
            {sources.map((s) => (
              <li key={s!.id}>{renderApa(s!.apa)}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted">{content.rules.texts.disclaimer}</p>

      <p className="border-t border-line pt-4 text-xs text-muted print:block">
        {fillTemplate(ui.printFooter, { date })}
      </p>

      <p className="no-print text-xs text-muted">
        <a href="/licenses/OFL-libre-franklin.txt" className="text-accent underline">
          {ui.fontLicenses}
        </a>
      </p>

      <div className="no-print space-y-2 border-t border-line pt-4">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-ink hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {ui.actions.print}
        </button>
        <p className="text-xs text-muted">{ui.actions.printHint}</p>
      </div>
    </article>
  )
}
