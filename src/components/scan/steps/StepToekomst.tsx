import { content } from '../../../content'
import type { FutureId } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'

export function StepToekomst({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[3]

  return (
    <div className="space-y-4">
      <div className="space-y-2" role="radiogroup" aria-label={cfg.title}>
        {content.context.future.options.map((opt, idx) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer gap-3 rounded-xl border p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              scan.session.future === opt.id ? 'border-accent bg-accent/10' : 'border-line bg-bg2'
            }`}
          >
            <input
              type="radio"
              name="future"
              id={idx === 0 ? 'scan-focus-future' : undefined}
              data-scan-focus={idx === 0 ? 'scan-focus-future' : undefined}
              checked={scan.session.future === opt.id}
              onChange={() => scan.setPartial({ future: opt.id as FutureId })}
              className="mt-1 accent-accent"
            />
            <div>
              <p className="font-semibold text-ink">{opt.title}</p>
              <p className="text-sm text-muted">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>
      {scan.session.future === 'anders' && (
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{cfg.noteLabel}</span>
          <textarea
            value={scan.session.futureNote}
            onChange={(e) => scan.setPartial({ futureNote: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-line bg-bg2 px-3 py-2 text-ink focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
      )}
    </div>
  )
}
