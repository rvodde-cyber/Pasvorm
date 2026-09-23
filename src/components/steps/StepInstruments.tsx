import { bundles } from '../../data/bundles'
import { instruments } from '../../data/instruments'
import type { ScanState } from '../../hooks/useScanState'
import { bundleStrength } from '../../utils/recommendation'
import { StepLabel, StepNav } from './StepNav'

function visibleInstrument(minSize: number, orgSize: number): boolean {
  if (minSize === 0) return true
  if (orgSize === 0) return true
  return orgSize >= minSize
}

export function StepInstruments({ scan }: { scan: ScanState }) {
  return (
    <div className="scan-card space-y-6">
      <StepLabel>Stap 5 van 6 · Aanwezige HR-instrumenten</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">
        Welke HR-instrumenten zijn al structureel aanwezig?
      </h2>
      <p className="text-muted">
        Vink aan welke instrumenten op dit moment structureel worden ingezet. De instrumenten zijn
        gegroepeerd per bundel — samen versterken zij elkaar.
      </p>

      {bundles.map((bundle) => {
        const pct = bundleStrength(bundle.id, scan.present)
        const list = instruments.filter(
          (i) => i.bundle === bundle.id && visibleInstrument(i.minSize, scan.orgSize),
        )
        return (
          <section key={bundle.id} className="rounded-xl border border-line bg-bg2/40 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: bundle.color }} />
                {bundle.label}
              </div>
              <div className="ml-auto flex min-w-[120px] flex-1 items-center gap-2 sm:max-w-[200px]">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: bundle.color }}
                  />
                </div>
                <span className="text-xs tabular-nums text-muted">{pct}%</span>
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted">{bundle.description}</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {list.map((inst) => {
                const on = !!scan.present[inst.id]
                return (
                  <li key={inst.id}>
                    <label
                      className={`flex h-full cursor-pointer gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                        on ? 'border-primary/50 bg-primary/5' : 'border-line bg-surface'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => scan.toggleInstrument(inst.id)}
                        className="mt-0.5 accent-primary"
                      />
                      <span>
                        <span className="font-semibold text-ink">{inst.label}</span>
                        <span className="mt-0.5 block text-xs text-muted">{inst.description}</span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <StepNav scan={scan} canNext nextLabel="Bekijk advies" />
    </div>
  )
}
