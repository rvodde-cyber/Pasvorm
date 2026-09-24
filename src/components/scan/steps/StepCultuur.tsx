import { content } from '../../../content'
import type { QuadrantId } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'

const QUADRANTS: QuadrantId[] = ['clan', 'adhocracy', 'market', 'hierarchy']

export function StepCultuur({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[2]
  const stepSize = cfg.stepSize ?? 5
  const max = content.culture.pointsPerDimension

  const setScore = (dimId: string, q: QuadrantId, value: number) => {
    const dim = dimId as keyof typeof scan.session.culture
    const next = { ...scan.session.culture[dim], [q]: Math.max(0, Math.min(max, value)) }
    scan.setPartial({ culture: { ...scan.session.culture, [dim]: next } })
  }

  return (
    <div className="space-y-6">
      {content.culture.dimensions.map((dim) => {
        const scores = scan.session.culture[dim.id as keyof typeof scan.session.culture]
        const sum = QUADRANTS.reduce((a, q) => a + scores[q], 0)
        const remaining = max - sum
        let status = cfg.done!
        if (remaining > 0) status = cfg.remaining!.replace('{n}', String(remaining))
        else if (remaining < 0) status = cfg.over!.replace('{n}', String(-remaining))

        const firstInputId = `scan-focus-culture-${dim.id}`

        return (
          <section key={dim.id} className="space-y-3 rounded-xl border border-line bg-bg2 p-4">
            <h3 className="font-heading text-sm font-bold text-ink">{dim.label}</h3>
            <p className="text-sm text-muted" aria-live="polite">{status}</p>
            <ul className="space-y-3">
              {QUADRANTS.map((q, qi) => {
                const description = dim.items[q]
                return (
                  <li key={q} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <p className="flex-1 text-sm text-ink">{description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`${description} minus`}
                        onClick={() => setScore(dim.id, q, scores[q] - stepSize)}
                        className="size-9 rounded-lg border border-line text-lg font-bold text-ink hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        max={max}
                        id={qi === 0 ? firstInputId : undefined}
                        data-scan-focus={qi === 0 ? firstInputId : undefined}
                        value={scores[q]}
                        onChange={(e) => setScore(dim.id, q, parseInt(e.target.value, 10) || 0)}
                        className="w-16 rounded-lg border border-line bg-bg px-2 py-1 text-center text-ink focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label={description}
                      />
                      <button
                        type="button"
                        aria-label={`${description} plus`}
                        onClick={() => setScore(dim.id, q, scores[q] + stepSize)}
                        className="size-9 rounded-lg border border-line text-lg font-bold text-ink hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
