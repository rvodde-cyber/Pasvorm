import { content } from '../content'
import { SCAN_STEP_COUNT } from '../scan/constants'

export function ProgressTape({ currentStep }: { currentStep: number }) {
  const displayStep = Math.min(currentStep + 1, SCAN_STEP_COUNT)
  const label = content.ui.progressLabel
    .replace('{current}', String(displayStep))
    .replace('{total}', String(SCAN_STEP_COUNT))

  return (
    <div className="mb-4 space-y-2" aria-label={label}>
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="flex items-center gap-1 px-1" role="presentation">
        {Array.from({ length: SCAN_STEP_COUNT }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-sm border border-accent/40 ${
              i <= currentStep ? 'bg-accent' : 'bg-bg2'
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
