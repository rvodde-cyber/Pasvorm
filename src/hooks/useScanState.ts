import { useCallback, useEffect, useMemo, useState } from 'react'
import { coreOptions, type CoreId } from '../data/core'
import { cvfItems, type CultureId } from '../data/cvf'
import { scanExample } from '../data/example'
import { futureOptions, type FutureId } from '../data/future'
import { phases } from '../data/phases'
import { buildRecommendation, type Recommendation } from '../utils/recommendation'
import { type CvfScores, cvfAllAnswered } from '../utils/culture'
import { clearStored, loadStored, saveStored } from '../utils/storage'

export const SCAN_STEPS = [
  'intro',
  'phase',
  'cvf',
  'future',
  'core',
  'instruments',
  'results',
] as const

export type ScanStep = (typeof SCAN_STEPS)[number]

export const TOTAL_STEPS = 7

const emptyCvf = (): CvfScores => ({
  clan: null,
  adhocracy: null,
  market: null,
  hierarchy: null,
})

export interface ScanState {
  step: ScanStep
  stepIndex: number
  totalSteps: number
  org: string
  size: string
  phaseId: number | null
  cvfScores: CvfScores
  futureId: FutureId | null
  futureNote: string
  coreId: CoreId | null
  present: Record<string, boolean>
  recommendation: Recommendation | null
  setOrg: (v: string) => void
  setSize: (v: string) => void
  setPhaseId: (id: number) => void
  setCvfScore: (id: CultureId, value: number) => void
  setFutureId: (id: FutureId) => void
  setFutureNote: (v: string) => void
  setCoreId: (id: CoreId) => void
  toggleInstrument: (id: string) => void
  fillExample: () => void
  goNext: () => void
  goBack: () => void
  goToStep: (step: ScanStep) => void
  reset: () => void
  cvfComplete: boolean
  orgSize: number
}

interface StoredScan {
  step: ScanStep
  org: string
  size: string
  phaseId: number | null
  cvfScores: CvfScores
  futureId: FutureId | null
  futureNote: string
  coreId: CoreId | null
  present: Record<string, boolean>
}

const initialPresent = (): Record<string, boolean> => ({})

const initial = (): StoredScan => ({
  step: 'intro',
  org: '',
  size: '',
  phaseId: null,
  cvfScores: emptyCvf(),
  futureId: null,
  futureNote: '',
  coreId: null,
  present: initialPresent(),
})

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function pick<T>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

function parseStored(raw: unknown): StoredScan {
  const base = initial()
  if (!isRecord(raw)) return base

  const cvfScores = emptyCvf()
  if (isRecord(raw.cvfScores)) {
    for (const item of cvfItems) {
      const v = raw.cvfScores[item.id]
      if (typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5) cvfScores[item.id] = v
    }
  }

  const present: Record<string, boolean> = {}
  if (isRecord(raw.present)) {
    for (const [id, v] of Object.entries(raw.present)) if (v === true) present[id] = true
  }

  return {
    step: pick(raw.step, SCAN_STEPS, base.step),
    org: typeof raw.org === 'string' ? raw.org : base.org,
    size: typeof raw.size === 'string' ? raw.size : base.size,
    phaseId: pick(raw.phaseId, phases.map((p) => p.id), base.phaseId),
    cvfScores,
    futureId: pick(raw.futureId, futureOptions.map((o) => o.id), base.futureId),
    futureNote: typeof raw.futureNote === 'string' ? raw.futureNote : base.futureNote,
    coreId: pick(raw.coreId, coreOptions.map((o) => o.id), base.coreId),
    present,
  }
}

function isPristine(s: StoredScan): boolean {
  return (
    s.step === 'intro' &&
    !s.org &&
    !s.size &&
    s.phaseId == null &&
    cvfItems.every((item) => s.cvfScores[item.id] == null) &&
    s.futureId == null &&
    !s.futureNote &&
    s.coreId == null &&
    Object.keys(s.present).length === 0
  )
}

export function useScanState(): ScanState {
  const [stored] = useState(() => parseStored(loadStored()))
  const [step, setStep] = useState<ScanStep>(stored.step)
  const [org, setOrg] = useState(stored.org)
  const [size, setSize] = useState(stored.size)
  const [phaseId, setPhaseId] = useState<number | null>(stored.phaseId)
  const [cvfScores, setCvfScores] = useState<CvfScores>(stored.cvfScores)
  const [futureId, setFutureId] = useState<FutureId | null>(stored.futureId)
  const [futureNote, setFutureNote] = useState(stored.futureNote)
  const [coreId, setCoreId] = useState<CoreId | null>(stored.coreId)
  const [present, setPresent] = useState<Record<string, boolean>>(stored.present)

  useEffect(() => {
    const snapshot: StoredScan = {
      step,
      org,
      size,
      phaseId,
      cvfScores,
      futureId,
      futureNote,
      coreId,
      present,
    }
    if (isPristine(snapshot)) clearStored()
    else saveStored(snapshot)
  }, [step, org, size, phaseId, cvfScores, futureId, futureNote, coreId, present])

  const stepIndex = SCAN_STEPS.indexOf(step)
  const orgSize = parseInt(size, 10) || 0
  const cvfComplete = cvfAllAnswered(cvfScores)

  const setCvfScore = useCallback((id: CultureId, value: number) => {
    setCvfScores((prev) => ({ ...prev, [id]: value }))
  }, [])

  const toggleInstrument = useCallback((id: string) => {
    setPresent((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }, [])

  const goToStep = useCallback((s: ScanStep) => setStep(s), [])

  const goNext = useCallback(() => {
    const idx = SCAN_STEPS.indexOf(step)
    if (idx < SCAN_STEPS.length - 1) setStep(SCAN_STEPS[idx + 1])
  }, [step])

  const goBack = useCallback(() => {
    const idx = SCAN_STEPS.indexOf(step)
    if (idx > 0) setStep(SCAN_STEPS[idx - 1])
  }, [step])

  const reset = useCallback(() => {
    const s = initial()
    setStep(s.step)
    setOrg(s.org)
    setSize(s.size)
    setPhaseId(s.phaseId)
    setCvfScores(s.cvfScores)
    setFutureId(s.futureId)
    setFutureNote(s.futureNote)
    setCoreId(s.coreId)
    setPresent(s.present)
    clearStored()
  }, [])

  const fillExample = useCallback(() => {
    setOrg(scanExample.org)
    setSize(scanExample.size)
    setPhaseId(scanExample.phaseId)
    setCvfScores({ ...scanExample.cvfScores })
    setFutureId(scanExample.futureId)
    setFutureNote(scanExample.futureNote)
    setCoreId(scanExample.coreId)
    setPresent({ ...scanExample.present })
    setStep('results')
  }, [])

  const recommendation = useMemo(() => {
    if (phaseId == null || !cvfComplete) return null
    return buildRecommendation(phaseId, cvfScores, present, orgSize)
  }, [phaseId, cvfScores, present, orgSize, cvfComplete])

  return {
    step,
    stepIndex,
    totalSteps: TOTAL_STEPS,
    org,
    size,
    phaseId,
    cvfScores,
    futureId,
    futureNote,
    coreId,
    present,
    recommendation,
    setOrg,
    setSize,
    setPhaseId,
    setCvfScore,
    setFutureId,
    setFutureNote,
    setCoreId,
    toggleInstrument,
    fillExample,
    goNext,
    goBack,
    goToStep,
    reset,
    cvfComplete,
    orgSize,
  }
}
