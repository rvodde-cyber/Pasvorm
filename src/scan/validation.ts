import { content } from '../content'
import type { ScanSession } from './types'

export function stepError(step: number, session: ScanSession): string | null {
  const steps = content.ui.steps
  if (step === 0) {
    const cfg = steps[0]
    const n = session.size
    if (n === '' || !Number.isInteger(n) || n < 1) return cfg.fields?.size.error ?? cfg.error ?? ''
    return null
  }
  if (step === 1) {
    const cfg = steps[1]
    if (!session.phaseFirst || !session.phaseSecond) return cfg.error ?? ''
    for (const id of cfg.crisisOrder ?? []) {
      if (!session.crisis[id as keyof typeof session.crisis]) return cfg.error ?? ''
    }
    return null
  }
  if (step === 2) {
    const cfg = steps[2]
    for (const dim of content.culture.dimensions) {
      const scores = session.culture[dim.id as keyof ScanSession['culture']]
      const sum = Object.values(scores).reduce((a, b) => a + b, 0)
      if (sum !== content.culture.pointsPerDimension) return cfg.error ?? ''
    }
    return null
  }
  if (step === 3) {
    const cfg = steps[3]
    if (!session.future) return cfg.error ?? ''
    return null
  }
  if (step === 4) {
    const cfg = steps[4]
    if (!session.workforce) return cfg.error ?? ''
    return null
  }
  if (step === 5) return null
  if (step === 6) {
    const cfg = steps[6]
    for (const item of content.mmv.items) {
      if (session.mmv[item.id as keyof typeof session.mmv] == null) return cfg.error ?? ''
    }
    return null
  }
  return null
}

export function isStepValid(step: number, session: ScanSession): boolean {
  return stepError(step, session) === null
}
