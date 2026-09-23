import { useCallback, useMemo, useState } from 'react'
import type { CoreId } from '../data/core'
import type { CultureId } from '../data/cvf'
import type { FutureId } from '../data/future'
import { buildRecommendation, type Recommendation } from '../utils/recommendation'
import { type CvfScores, cvfAllAnswered } from '../utils/culture'

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

const initialPresent = (): Record<string, boolean> => ({})

const initial = {
  step: 'intro' as ScanStep,
  org: '',
  size: '',
  phaseId: null as number | null,
  cvfScores: emptyCvf(),
  futureId: null as FutureId | null,
  futureNote: '',
  coreId: null as CoreId | null,
  present: initialPresent(),
}

export function useScanState(): ScanState {
  const [step, setStep] = useState<ScanStep>(initial.step)
  const [org, setOrg] = useState(initial.org)
  const [size, setSize] = useState(initial.size)
  const [phaseId, setPhaseId] = useState<number | null>(initial.phaseId)
  const [cvfScores, setCvfScores] = useState<CvfScores>(initial.cvfScores)
  const [futureId, setFutureId] = useState<FutureId | null>(initial.futureId)
  const [futureNote, setFutureNote] = useState(initial.futureNote)
  const [coreId, setCoreId] = useState<CoreId | null>(initial.coreId)
  const [present, setPresent] = useState<Record<string, boolean>>(initial.present)

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
    setStep(initial.step)
    setOrg(initial.org)
    setSize(initial.size)
    setPhaseId(initial.phaseId)
    setCvfScores(emptyCvf())
    setFutureId(initial.futureId)
    setFutureNote(initial.futureNote)
    setCoreId(initial.coreId)
    setPresent(initialPresent())
  }, [])

  const fillExample = useCallback(() => {
    setOrg('Schoonmaakbedrijf (voorbeeld)')
    setSize('200')
    setPhaseId(2)
    setCvfScores({ clan: 2, adhocracy: 1, market: 3, hierarchy: 5 })
    setFutureId('gelijk')
    setFutureNote('')
    setCoreId('uitvoerend')
    setPresent({
      personeelsdossier: true,
      arbeidsovereenkomsten: true,
      verzuimbeleid: true,
      avg_privacy: true,
      rie: true,
      medezeggenschap: true,
    })
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
