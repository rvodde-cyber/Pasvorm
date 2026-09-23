import { cvfCultures } from '../../data/cvf'
import type { ScanState } from '../../hooks/useScanState'
import { StepNav } from './StepPhase'

export function StepCvf({ scan }: { scan: ScanState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Dominante cultuur</h2>
        <p className="mt-2 text-muted">Competing Values Framework (Cameron & Quinn)</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cvfCultures.map((c) => {
          const selected = scan.cultureId === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => scan.setCultureId(c.id)}
              className={`rounded-xl border px-4 py-4 text-left transition ${
                selected ? 'ring-1' : 'border-line bg-surface hover:brightness-110'
              }`}
              style={{
                borderColor: selected ? c.color : undefined,
                backgroundColor: selected ? `${c.color}18` : undefined,
                boxShadow: selected ? `0 0 0 1px ${c.color}` : undefined,
              }}
            >
              <span className="font-heading font-bold" style={{ color: c.color }}>
                {c.label}
              </span>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
            </button>
          )
        })}
      </div>

      <StepNav scan={scan} canNext={scan.cultureId != null} />
    </div>
  )
}
