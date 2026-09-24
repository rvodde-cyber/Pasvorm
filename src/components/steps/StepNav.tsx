import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  const [confirming, setConfirming] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!confirming) return
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirming(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirming])

  if (confirming) {
    return (
      <div
        role="group"
        aria-label="Bevestiging wissen"
        className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-bg2 px-3 py-2"
      >
        <p className="text-sm text-muted">Weet u het zeker? Al uw antwoorden worden gewist.</p>
        <button
          ref={cancelRef}
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface"
        >
          Annuleren
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirming(false)
            onClear()
          }}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink hover:brightness-110"
        >
          Ja, wissen
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
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
