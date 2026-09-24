import { content } from '../../../content'
import { BUNDLE_ORDER } from '../../../scan/constants'
import type { InstrumentId, StageValue } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'
import { InstrumentTile } from '../InstrumentTile'

export function StepInstrumenten({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[5]

  const setStage = (id: InstrumentId, v: StageValue) => {
    scan.setPartial({ stages: { ...scan.session.stages, [id]: v } })
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted">{cfg.help}</p>
      {BUNDLE_ORDER.map((bundle) => {
        const insts = content.instruments.instruments.filter((i) => i.bundle === bundle)
        return (
          <section key={bundle} aria-labelledby={`bundle-${bundle}`}>
            <h3 id={`bundle-${bundle}`} className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
              {bundle}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {insts.map((inst) => (
                <InstrumentTile
                  key={inst.id}
                  instrumentId={inst.id as InstrumentId}
                  stage={(scan.session.stages[inst.id as InstrumentId] ?? 0) as StageValue}
                  onStage={(v) => setStage(inst.id as InstrumentId, v)}
                />
              ))}
            </div>
          </section>
        )
      })}
      <section className="rounded-xl border border-line bg-bg2 p-4">
        <h3 className="font-heading text-sm font-bold text-ink">{cfg.legendTitle}</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
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
