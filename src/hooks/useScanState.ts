import { useCallback, useMemo, useState } from 'react'
import type { CultureId } from '../data/cvf'
import { buildRecommendation, type Recommendation } from '../utils/recommendation'

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

export interface ScanState {
  step: ScanStep
  stepIndex: number
  totalSteps: number
  phaseId: number | null
  cultureId: CultureId | null
  futureFocus: string | null
  corePriority: BundleIdOrNull
  presentInstruments: string[]
  recommendation: Recommendation | null
  setPhaseId: (id: number) => void
  setCultureId: (id: CultureId) => void
  setFutureFocus: (focus: string) => void
  setCorePriority: (bundle: BundleIdOrNull) => void
  toggleInstrument: (id: string) => void
  goNext: () => void
  goBack: () => void
  goToStep: (step: ScanStep) => void
  reset: () => void
}

type BundleIdOrNull = import('../data/bundles').BundleId | null

const initial = {
  step: 'intro' as ScanStep,
  phaseId: null as number | null,
  cultureId: null as CultureId | null,
  futureFocus: null as string | null,
  corePriority: null as BundleIdOrNull,
  presentInstruments: [] as string[],
}

export function useScanState(): ScanState {
  const [step, setStep] = useState<ScanStep>(initial.step)
  const [phaseId, setPhaseId] = useState<number | null>(initial.phaseId)
  const [cultureId, setCultureId] = useState<CultureId | null>(initial.cultureId)
  const [futureFocus, setFutureFocus] = useState<string | null>(initial.futureFocus)
  const [corePriority, setCorePriority] = useState<BundleIdOrNull>(initial.corePriority)
  const [presentInstruments, setPresentInstruments] = useState<string[]>(
    initial.presentInstruments,
  )

  const stepIndex = SCAN_STEPS.indexOf(step)
  const totalSteps = SCAN_STEPS.length

  const toggleInstrument = useCallback((id: string) => {
    setPresentInstruments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const goToStep = useCallback((s: ScanStep) => setStep(s), [])

  const goNext = useCallback(() => {
    const idx = SCAN_STEPS.indexOf(step)
    if (idx < SCAN_STEPS.length - 1) {
      setStep(SCAN_STEPS[idx + 1])
    }
  }, [step])

  const goBack = useCallback(() => {
    const idx = SCAN_STEPS.indexOf(step)
    if (idx > 0) {
      setStep(SCAN_STEPS[idx - 1])
    }
  }, [step])

  const reset = useCallback(() => {
    setStep(initial.step)
    setPhaseId(initial.phaseId)
    setCultureId(initial.cultureId)
    setFutureFocus(initial.futureFocus)
    setCorePriority(initial.corePriority)
    setPresentInstruments(initial.presentInstruments)
  }, [])

  const recommendation = useMemo(() => {
    if (phaseId == null || cultureId == null) return null
    return buildRecommendation(phaseId, cultureId, presentInstruments)
  }, [phaseId, cultureId, presentInstruments])

  return {
    step,
    stepIndex,
    totalSteps,
    phaseId,
    cultureId,
    futureFocus,
    corePriority,
    presentInstruments,
    recommendation,
    setPhaseId,
    setCultureId,
    setFutureFocus,
    setCorePriority,
    toggleInstrument,
    goNext,
    goBack,
    goToStep,
    reset,
  }
}
