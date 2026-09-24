import type {
  CrisisAnswer,
  CrisisId,
  DimensionId,
  FutureId,
  InstrumentId,
  MmvId,
  MmvScore,
  PhaseId,
  QuadrantId,
  ScanInput,
  StageValue,
  WorkforceId,
} from '../engine/types'

export interface ScanSession {
  step: number
  orgName: string
  size: number | ''
  phaseFirst: PhaseId | null
  phaseSecond: PhaseId | null
  crisis: Partial<Record<CrisisId, CrisisAnswer>>
  culture: Record<DimensionId, Record<QuadrantId, number>>
  future: FutureId | null
  futureNote: string
  workforce: WorkforceId | null
  stages: Partial<Record<InstrumentId, StageValue>>
  mmv: Partial<Record<MmvId, MmvScore>>
}

export function sessionToScanInput(session: ScanSession): ScanInput {
  return {
    size: typeof session.size === 'number' ? session.size : 0,
    phaseChoices: [session.phaseFirst ?? 'f1', session.phaseSecond ?? 'f1'],
    crisis: session.crisis,
    culture: session.culture,
    future: session.future ?? 'gelijk',
    futureNote: session.futureNote || undefined,
    workforce: session.workforce ?? 'uitvoerend',
    stages: session.stages,
    mmv: session.mmv,
  }
}
