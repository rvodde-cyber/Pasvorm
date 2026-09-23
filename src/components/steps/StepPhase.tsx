import { phases } from '../../data/phases'
import type { ScanState } from '../../hooks/useScanState'

export function StepPhase({ scan }: { scan: ScanState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Groeifase</h2>
        <p className="mt-2 text-muted">
          Waar herkent u de organisatie het meest in? (Greiner, 1972)
        </p>
      </div>

      <ul className="space-y-3">
        {phases.map((p) => {
          const selected = scan.phaseId === p.id
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => scan.setPhaseId(p.id)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                  selected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-line bg-surface hover:border-primary/40'
                }`}
              >
                <span className="font-heading font-bold text-ink">
                  Fase {p.id}: {p.title}
                </span>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </button>
            </li>
          )
        })}
      </ul>

      <Nav scan={scan} canNext={scan.phaseId != null} />
    </div>
  )
}

function Nav({ scan, canNext }: { scan: ScanState; canNext: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={scan.goBack}
        className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface"
      >
        Terug
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={scan.goNext}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-ink disabled:opacity-40"
      >
        Volgende
      </button>
    </div>
  )
}

export { Nav as StepNav }
