import { useCallback, useEffect, useMemo, useState } from 'react'
import { evaluate } from '../engine'
import { createInitialSession } from '../scan/initial'
import { fillExampleSession } from '../scan/exampleCase'
import { clearSession, loadSession, saveSession } from '../scan/storage'
import type { ScanSession } from '../scan/types'
import { sessionToScanInput } from '../scan/types'
import { isStepValid } from '../scan/validation'

function parseStored(raw: unknown): ScanSession {
  const base = createInitialSession()
  if (!raw || typeof raw !== 'object') return base
  const o = raw as Record<string, unknown>
  return {
    ...base,
    ...(typeof o.step === 'number' && o.step >= 0 && o.step <= 7 ? { step: o.step } : {}),
    orgName: typeof o.orgName === 'string' ? o.orgName : base.orgName,
    size:
      typeof o.size === 'number' && Number.isInteger(o.size)
        ? o.size
        : o.size === ''
          ? ''
          : base.size,
    phaseFirst: typeof o.phaseFirst === 'string' ? (o.phaseFirst as ScanSession['phaseFirst']) : base.phaseFirst,
    phaseSecond:
      typeof o.phaseSecond === 'string' ? (o.phaseSecond as ScanSession['phaseSecond']) : base.phaseSecond,
    crisis: typeof o.crisis === 'object' && o.crisis ? (o.crisis as ScanSession['crisis']) : base.crisis,
    culture: typeof o.culture === 'object' && o.culture ? (o.culture as ScanSession['culture']) : base.culture,
    future: typeof o.future === 'string' ? (o.future as ScanSession['future']) : base.future,
    futureNote: typeof o.futureNote === 'string' ? o.futureNote : base.futureNote,
    workforce:
      typeof o.workforce === 'string' ? (o.workforce as ScanSession['workforce']) : base.workforce,
    stages: typeof o.stages === 'object' && o.stages ? (o.stages as ScanSession['stages']) : base.stages,
    mmv: typeof o.mmv === 'object' && o.mmv ? (o.mmv as ScanSession['mmv']) : base.mmv,
  }
}

export function useScanSession() {
  const [session, setSession] = useState<ScanSession>(() => parseStored(loadSession()))

  useEffect(() => {
    saveSession(session)
  }, [session])

  const setPartial = useCallback((patch: Partial<ScanSession>) => {
    setSession((prev) => ({ ...prev, ...patch }))
  }, [])

  const goStep = useCallback((step: number) => setPartial({ step }), [setPartial])

  const goNext = useCallback(() => {
    setSession((prev) => ({ ...prev, step: Math.min(prev.step + 1, 7) }))
  }, [])

  const goBack = useCallback(() => {
    setSession((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }))
  }, [])

  const reset = useCallback(() => {
    clearSession()
    setSession(createInitialSession())
  }, [])

  const fillExample = useCallback(() => {
    setSession(fillExampleSession())
  }, [])

  const canProceed = useMemo(() => {
    if (session.step >= 7) return true
    return isStepValid(session.step, session)
  }, [session])

  const result = useMemo(() => {
    if (session.step < 7) return null
    return evaluate(sessionToScanInput(session))
  }, [session])

  return {
    session,
    setPartial,
    goStep,
    goNext,
    goBack,
    reset,
    fillExample,
    canProceed,
    result,
  }
}

export type ScanSessionApi = ReturnType<typeof useScanSession>
