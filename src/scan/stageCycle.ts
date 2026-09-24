import type { StageValue } from '../engine/types'

export function nextStage(current: StageValue): StageValue {
  return ((current + 1) % 4) as StageValue
}
