import { bundleById } from '../../data/bundles'
import { instruments } from '../../data/instruments'
import type { ScanState } from '../../hooks/useScanState'
import { StepNav } from './StepPhase'

export function StepInstruments({ scan }: { scan: ScanState }) {
  const grouped = instruments.reduce(
    (acc, inst) => {
      if (!acc[inst.bundle]) acc[inst.bundle] = []
      acc[inst.bundle].push(inst)
      return acc
    },
    {} as Record<string, typeof instruments>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Instrumenten</h2>
        <p className="mt-2 text-muted">
          Vink aan wat in uw organisatie al (minimaal) aanwezig is — ook informeel of in ontwikkeling.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([bundleId, list]) => {
          const bundle = bundleById[bundleId as keyof typeof bundleById]
          return (
            <section key={bundleId}>
              <h3 className="mb-2 font-heading text-sm font-bold" style={{ color: bundle.color }}>
                {bundle.label}
              </h3>
              <ul className="space-y-2">
                {list.map((inst) => {
                  const on = scan.presentInstruments.includes(inst.id)
                  return (
                    <li key={inst.id}>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-3 transition ${
                          on ? 'border-primary/50 bg-primary/5' : 'border-line bg-surface'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => scan.toggleInstrument(inst.id)}
                          className="mt-1 size-4 accent-primary"
                        />
                        <span className="flex-1">
                          <span className="font-semibold text-ink">
                            {inst.name}
                            {inst.legal && (
                              <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                                Wettelijk
                              </span>
                            )}
                          </span>
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
      </div>

      <StepNav scan={scan} canNext />
    </div>
  )
}
