import { content } from '../../../content'
import type { MmvId, MmvScore } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'

const mmvBorder: Record<string, string> = {
  zien: 'border-mmv-zien',
  voelen: 'border-mmv-voelen',
  wegen: 'border-mmv-wegen',
  handelen: 'border-mmv-handelen',
  volhouden: 'border-mmv-volhouden',
}

export function StepMoreel({ scan }: { scan: ScanSessionApi }) {
  const scale = content.mmv.scale

  return (
    <div className="space-y-6">
      {content.mmv.items.map((item) => {
        const border = mmvBorder[item.color] ?? 'border-line'
        const current = scan.session.mmv[item.id as MmvId]
        return (
          <fieldset
            key={item.id}
            className={`space-y-3 rounded-xl border-l-4 bg-bg2 p-4 ${border}`}
          >
            <legend className="text-sm font-semibold text-ink">{item.statement}</legend>
            <div className="flex justify-between text-xs text-muted">
              <span>{scale.minLabel}</span>
              <span>{scale.maxLabel}</span>
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={item.statement}>
              {Array.from({ length: scale.max - scale.min + 1 }, (_, i) => scale.min + i).map((v, vi) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-line px-2 py-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
                >
                  <input
                    type="radio"
                    name={`mmv-${item.id}`}
                    id={vi === 0 ? `scan-focus-mmv-${item.id}` : undefined}
                    data-scan-focus={vi === 0 ? `scan-focus-mmv-${item.id}` : undefined}
                    checked={current === v}
                    onChange={() =>
                      scan.setPartial({
                        mmv: { ...scan.session.mmv, [item.id]: v as MmvScore },
                      })
                    }
                    className="accent-accent"
                  />
                  <span className="text-sm tabular-nums text-ink">{v}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
