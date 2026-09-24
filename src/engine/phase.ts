import { content } from '../content'
import type { CrisisAnswer, PhaseId, PhaseOutcome, ScanInput } from './types'

const phaseOrder: Record<PhaseId, number> = Object.fromEntries(
  content.phases.phases.map((p) => [p.id, p.order]),
) as Record<PhaseId, number>

const crisisByPhase: Record<PhaseId, string> = Object.fromEntries(
  content.phases.crisisSignals.map((s) => [s.phaseId, s.id]),
) as Record<PhaseId, string>

export function evaluatePhase(input: ScanInput): PhaseOutcome {
  const dominant = input.phaseChoices[0]
  const second = input.phaseChoices[1]
  const gap = Math.abs(phaseOrder[second] - phaseOrder[dominant])
  const crisisId = crisisByPhase[dominant]
  const crisisAnswer: CrisisAnswer = (input.crisis[crisisId as keyof typeof input.crisis] ??
    'nee') as CrisisAnswer
  const transition =
    phaseOrder[second] === phaseOrder[dominant] + 1 &&
    (crisisAnswer === 'ja' || crisisAnswer === 'deels')
  const inconsistent = gap > 1

  return { dominant, second, transition, inconsistent }
}

export function phaseOrderOf(id: PhaseId): number {
  return phaseOrder[id]
}

export function phaseIdByOrder(order: number): PhaseId {
  const found = content.phases.phases.find((p) => p.order === order)
  if (!found) throw new Error(`Geen fase met order ${order}`)
  return found.id
}

export function phaseName(id: PhaseId): string {
  return content.phases.phases.find((p) => p.id === id)?.name ?? id
}
