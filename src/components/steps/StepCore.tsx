import { coreOptions } from '../../data/core'
import type { ScanState } from '../../hooks/useScanState'
import { StepLabel, StepNav } from './StepNav'

export function StepCore({ scan }: { scan: ScanState }) {
  return (
    <div className="scan-card space-y-5">
      <StepLabel>Stap 4 van 6 · Omvangrijkste personeelsgroep</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">
        Hoe typeert u de omvangrijkste personeelsgroep?
      </h2>
      <p className="text-muted">
        Naar Lepak & Snell (1999): waarde en schaarste van deze groep beïnvloeden het passende
        HR-beleid.
      </p>

      <ul className="space-y-2">
        {coreOptions.map((opt) => {
          const selected = scan.coreId === opt.id
          return (
            <li key={opt.id}>
              <label
                className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                  selected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-line bg-surface hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="core"
                  checked={selected}
                  onChange={() => scan.setCoreId(opt.id)}
                  className="mt-1 accent-primary"
                />
                <span>
                  <span className="block font-heading font-bold text-ink">{opt.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{opt.description}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <StepNav scan={scan} canNext={scan.coreId != null} />
    </div>
  )
}
