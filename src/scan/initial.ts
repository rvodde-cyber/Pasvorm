import { content } from '../content'
import type { QuadrantId } from '../engine/types'
import type { ScanSession } from './types'

const evenSplit = (): Record<QuadrantId, number> => ({
  clan: 25,
  adhocracy: 25,
  market: 25,
  hierarchy: 25,
})

export function initialCulture(): ScanSession['culture'] {
  const base = evenSplit()
  const out = {} as ScanSession['culture']
  for (const dim of content.culture.dimensions) {
    out[dim.id as keyof ScanSession['culture']] = { ...base }
  }
  return out
}

export function createInitialSession(): ScanSession {
  return {
    step: 0,
    orgName: '',
    size: '',
    phaseFirst: null,
    phaseSecond: null,
    crisis: {},
    culture: initialCulture(),
    future: null,
    futureNote: '',
    workforce: null,
    stages: {},
    mmv: {},
  }
}
