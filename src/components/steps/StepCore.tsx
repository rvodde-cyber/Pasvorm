import { bundles } from '../../data/bundles'
import type { ScanState } from '../../hooks/useScanState'
import { StepNav } from './StepPhase'

export function StepCore({ scan }: { scan: ScanState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Kernprioriteit</h2>
        <p className="mt-2 text-muted">
          Welke bundel verdient nu de meeste aandacht naast wat al geregeld is? (AMO / bundels)
        </p>
      </div>

      <ul className="space-y-3">
        {bundles.map((b) => {
          const selected = scan.corePriority === b.id
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => scan.setCorePriority(b.id)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                  selected ? 'ring-1' : 'border-line bg-surface'
                }`}
                style={{
                  borderColor: selected ? b.color : undefined,
                  backgroundColor: selected ? `${b.color}15` : undefined,
                  boxShadow: selected ? `0 0 0 1px ${b.color}` : undefined,
                }}
              >
                <span className="font-heading font-bold" style={{ color: b.color }}>
                  {b.label}
                </span>
                <p className="mt-1 text-sm text-muted">{b.description}</p>
              </button>
            </li>
          )
        })}
      </ul>

      <StepNav scan={scan} canNext={scan.corePriority != null} />
    </div>
  )
}
