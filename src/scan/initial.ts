import { content } from '../content'
import type { QuadrantId } from '../engine/types'
import type { ScanSession } from './types'

function cultureStartValue(): number {
  const cultuur = content.ui.steps.find((s) => s.id === 'cultuur')
  return cultuur?.startValue ?? 0
}

const emptyScores = (): Record<QuadrantId, number> => {
  const v = cultureStartValue()
  return { clan: v, adhocracy: v, market: v, hierarchy: v }
}

export function initialCulture(): ScanSession['culture'] {
  const base = emptyScores()
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
