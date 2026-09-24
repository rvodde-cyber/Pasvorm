import { content } from '../../../content'
import type { WorkforceId } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'

export function StepPersoneel({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[4]

  return (
    <div className="space-y-2" role="radiogroup" aria-label={cfg.title}>
      {content.context.workforce.options.map((opt) => (
        <label
          key={opt.id}
          className={`flex cursor-pointer gap-3 rounded-xl border p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
            scan.session.workforce === opt.id ? 'border-accent bg-accent/10' : 'border-line bg-bg2'
          }`}
        >
          <input
            type="radio"
            name="workforce"
            checked={scan.session.workforce === opt.id}
            onChange={() => scan.setPartial({ workforce: opt.id as WorkforceId })}
            className="mt-1 accent-accent"
          />
          <div>
            <p className="font-semibold text-ink">{opt.title}</p>
            <p className="text-sm text-muted">{opt.description}</p>
          </div>
        </label>
      ))}
    </div>
  )
}
