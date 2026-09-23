import { cvfItems } from '../../data/cvf'
import type { ScanState } from '../../hooks/useScanState'
import { StepLabel, StepNav } from './StepNav'

export function StepCvf({ scan }: { scan: ScanState }) {
  return (
    <div className="scan-card space-y-5">
      <StepLabel>Stap 2 van 6 · Organisatiecultuur (CVF)</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">In hoeverre herkent u dit?</h2>
      <p className="text-muted">
        Geef per stelling aan in hoeverre deze de organisatie typeert (1 = helemaal niet, 5 = helemaal
        wel).
      </p>

      <div className="space-y-5">
        {cvfItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-line bg-bg2/50 p-4">
            <p className="text-sm leading-relaxed text-ink">{item.question}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = scan.cvfScores[item.id] === n
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => scan.setCvfScore(item.id, n)}
                    className={`size-9 rounded-lg border text-sm font-semibold transition ${
                      selected
                        ? 'border-transparent text-primary-ink'
                        : 'border-line bg-surface text-muted hover:border-primary/40'
                    }`}
                    style={selected ? { backgroundColor: item.color } : undefined}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-muted">
              <span>Helemaal niet</span>
              <span>Helemaal wel</span>
            </div>
          </div>
        ))}
      </div>

      <StepNav scan={scan} canNext={scan.cvfComplete} />
    </div>
  )
}
