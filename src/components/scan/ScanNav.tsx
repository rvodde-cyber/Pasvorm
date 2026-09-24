import { useEffect, useRef, useState } from 'react'
import { content } from '../../content'
import { stepError } from '../../scan/validation'
import type { ScanSession } from '../../scan/types'

export function ClearAnswersButton({ onClear }: { onClear: () => void }) {
  const nav = content.ui.nav
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
        aria-label={nav.clear}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-bg2 px-3 py-2"
      >
        <p className="text-sm text-muted">{nav.clearConfirm}</p>
        <button
          ref={cancelRef}
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {nav.clearCancel}
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirming(false)
            onClear()
          }}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {nav.clearYes}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {nav.clear}
    </button>
  )
}

export function ScanStepNav({
  step,
  session,
  showError,
  onBack,
  onNext,
  nextLabel,
}: {
  step: number
  session: ScanSession
  showError: boolean
  onBack: () => void
  onNext: () => void
  nextLabel?: string
}) {
  const nav = content.ui.nav
  const err = showError ? stepError(step, session) : null

  return (
    <div className="mt-8 space-y-2">
      {err && (
        <p className="text-sm text-market" role="alert">
          {err}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {nav.back}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="ml-auto rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {nextLabel ?? nav.next}
        </button>
      </div>
    </div>
  )
}
