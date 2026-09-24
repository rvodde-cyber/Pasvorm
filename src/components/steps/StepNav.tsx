import type { ReactNode } from 'react'
import type { ScanState } from '../../hooks/useScanState'

export function StepNav({
  scan,
  canNext = true,
  nextLabel = 'Volgende',
  onNext,
}: {
  scan: ScanState
  canNext?: boolean
  nextLabel?: string
  onNext?: () => void
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={scan.goBack}
        disabled={scan.stepIndex === 0}
        className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface disabled:opacity-40"
      >
        Terug
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={onNext ?? scan.goNext}
        className="ml-auto rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-ink disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  )
}

export function ClearAnswersButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface hover:text-ink"
    >
      Wis mijn antwoorden
    </button>
  )
}

export function StepLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-accent">{children}</p>
  )
}
