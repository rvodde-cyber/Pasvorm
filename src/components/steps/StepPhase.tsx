import { phases } from '../../data/phases'
import type { ScanState } from '../../hooks/useScanState'
import { StepLabel, StepNav } from './StepNav'

export function StepPhase({ scan }: { scan: ScanState }) {
  return (
    <div className="scan-card space-y-5">
      <StepLabel>Stap 1 van 6 · Groeifase (Greiner)</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">Welke omschrijving past het best?</h2>
      <p className="text-muted">
        Kies de omschrijving die de huidige manier van sturen en organiseren het beste weergeeft.
      </p>

      <ul className="space-y-2">
        {phases.map((p) => {
          const selected = scan.phaseId === p.id
          return (
            <li key={p.id}>
              <label
                className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                  selected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-line bg-surface hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="phase"
                  checked={selected}
                  onChange={() => scan.setPhaseId(p.id)}
                  className="mt-1 accent-primary"
                />
                <span>
                  <span className="block font-heading font-bold text-ink">{p.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{p.description}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <StepNav scan={scan} canNext={scan.phaseId != null} />
    </div>
  )
}
