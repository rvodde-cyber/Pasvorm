import type { InstrumentsFile } from '../content/schema'

export type PhaseId = 'f1' | 'f2' | 'f3' | 'f4' | 'f5'
export type CrisisId = 'c1' | 'c2' | 'c3' | 'c4' | 'c5'
export type QuadrantId = 'clan' | 'adhocracy' | 'market' | 'hierarchy'
export type DimensionId = 'd1' | 'd2' | 'd3'
export type FutureId = 'groei' | 'gelijk' | 'afbouw' | 'anders'
export type WorkforceId = 'uitvoerend' | 'vakmanschap' | 'schaars' | 'gemengd'
export type InstrumentId = InstrumentsFile['instruments'][number]['id']
export type MmvId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5'
export type BundleId = InstrumentsFile['instruments'][number]['bundle']
export type StageValue = 0 | 1 | 2 | 3
export type MmvScore = 1 | 2 | 3 | 4 | 5
export type CrisisAnswer = 'ja' | 'deels' | 'nee'
export type PriorityRuleId = 'R1' | 'R5' | 'R2' | 'R2b'

export interface ScanInput {
  size: number
  phaseChoices: [PhaseId, PhaseId]
  crisis: Partial<Record<CrisisId, CrisisAnswer>>
  culture: Record<DimensionId, Record<QuadrantId, number>>
  future: FutureId
  futureNote?: string
  workforce: WorkforceId
  stages: Partial<Record<InstrumentId, StageValue>>
  mmv: Partial<Record<MmvId, MmvScore>>
}

export interface PhaseOutcome {
  dominant: PhaseId
  second: PhaseId
  transition: boolean
  inconsistent: boolean
}

export interface CultureOutcome {
  profile: Record<QuadrantId, number>
  dominant: QuadrantId
  dominants: QuadrantId[]
  flat: boolean
  tension: boolean
}

export interface PriorityItem {
  instrumentId: InstrumentId
  rule: PriorityRuleId
  kind: string
  horizon: string
  why: string
  sourceIds: string[]
  firstStep: string
  formSentence?: string
}

export interface TemporaryItem {
  instrumentId: InstrumentId
  why: string
  horizon: string
}

export interface SignalItem {
  id: string
  instrumentId?: InstrumentId
  text: string
}

export interface EthicsNoteItem {
  instrumentId: InstrumentId
  mmvId: MmvId
  note: string
}

export type BundleFitStatus = 'krap' | 'past' | 'ruim'
export type BundleFitReason = 'legal' | 'shortfall' | 'ruim'

export interface BundleFitEntry {
  measured: number
  expected: number
  status: BundleFitStatus
  reason?: BundleFitReason
}

export interface EvaluateResult {
  phase: PhaseOutcome
  culture: CultureOutcome
  priorities: PriorityItem[]
  sufficient: boolean
  sufficientText?: string
  temporary: TemporaryItem[]
  external: string[]
  form: QuadrantId | null
  signals: SignalItem[]
  ethicsNotes: EthicsNoteItem[]
  bundleScores: Record<BundleId, number>
  bundleFit: Record<BundleId, BundleFitEntry>
  mmvScores: Record<MmvId, MmvScore>
  workforceNote?: string
  futureNote?: string
}
