import { content } from '../../../content'
import { BUNDLE_ORDER } from '../../../scan/constants'
import type { InstrumentId, StageValue } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'
import { InstrumentStageRow } from '../InstrumentStageRow'

const bundleById = Object.fromEntries(content.bundles.bundles.map((b) => [b.id, b]))

export function StepInstrumenten({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[5]

  const setStage = (id: InstrumentId, v: StageValue) => {
    scan.setPartial({ stages: { ...scan.session.stages, [id]: v } })
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">{cfg.help}</p>
      {BUNDLE_ORDER.map((bundleId) => {
        const meta = bundleById[bundleId]
        const insts = content.instruments.instruments.filter((i) => i.bundle === bundleId)
        return (
          <section key={bundleId} aria-labelledby={`bundle-${bundleId}`} className="space-y-1">
            <div id={`bundle-${bundleId}`} className="sticky top-0 z-10 bg-surface py-1">
              <h3 className="font-heading text-sm font-bold text-ink">
                {meta.label} <span className="font-normal text-muted">— {meta.subtitle}</span>
              </h3>
              <p className="text-xs text-muted">{meta.description}</p>
            </div>
            {insts.map((inst) => (
              <InstrumentStageRow
                key={inst.id}
                instrumentId={inst.id as InstrumentId}
                stage={(scan.session.stages[inst.id as InstrumentId] ?? 0) as StageValue}
                onStage={(v) => setStage(inst.id as InstrumentId, v)}
              />
            ))}
          </section>
        )
      })}
      <section className="rounded-lg border border-line bg-bg2 p-3">
        <h3 className="font-heading text-xs font-bold text-ink">{cfg.legendTitle}</h3>
        <ul className="mt-1 space-y-0.5 text-xs text-muted">
          {content.stages.stages.map((s) => (
            <li key={s.value}>
              <strong className="text-ink">{s.label}</strong> — {s.description}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
