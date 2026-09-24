import type { PhaseId } from '../engine/types'

export function togglePhaseChoice(
  phaseId: PhaseId,
  phaseFirst: PhaseId | null,
  phaseSecond: PhaseId | null,
): { phaseFirst: PhaseId | null; phaseSecond: PhaseId | null } {
  if (phaseFirst === phaseId) return { phaseFirst: null, phaseSecond }
  if (phaseSecond === phaseId) return { phaseFirst, phaseSecond: null }
  if (!phaseFirst) return { phaseFirst: phaseId, phaseSecond }
  if (!phaseSecond) return { phaseFirst, phaseSecond: phaseId }
  return { phaseFirst, phaseSecond }
}
