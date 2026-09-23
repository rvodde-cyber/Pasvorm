import { futureOptions } from '../../data/future'
import type { ScanState } from '../../hooks/useScanState'
import { StepLabel, StepNav } from './StepNav'

export function StepFuture({ scan }: { scan: ScanState }) {
  return (
    <div className="scan-card space-y-5">
      <StepLabel>Stap 3 van 6 · Toekomstvisie van de leiding</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">Welk scenario past het best?</h2>
      <p className="text-muted">Welke richting heeft de leiding voor de komende 2–3 jaar voor ogen?</p>

      <ul className="space-y-2">
        {futureOptions.map((opt) => {
          const selected = scan.futureId === opt.id
          return (
            <li key={opt.id}>
              <label
                className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition ${
                  selected
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-line bg-surface hover:border-accent/40'
                }`}
              >
                <input
                  type="radio"
                  name="future"
                  checked={selected}
                  onChange={() => scan.setFutureId(opt.id)}
                  className="mt-1 accent-accent"
                />
                <span className="flex-1">
                  <span className="block font-heading font-bold text-ink">{opt.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{opt.description}</span>
                  {opt.hasNote && selected && (
                    <textarea
                      rows={2}
                      value={scan.futureNote}
                      onChange={(e) => scan.setFutureNote(e.target.value)}
                      placeholder="Licht toe..."
                      className="mt-2 w-full rounded-lg border border-line bg-bg2 px-3 py-2 text-sm text-ink"
                    />
                  )}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <StepNav scan={scan} canNext={scan.futureId != null} />
    </div>
  )
}
