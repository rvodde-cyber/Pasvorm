import { content } from '../content'
import type { CultureOutcome, PhaseId, QuadrantId, ScanInput } from './types'

const QUADRANT_ORDER: QuadrantId[] = ['clan', 'adhocracy', 'market', 'hierarchy']

export function cultureProfile(input: ScanInput): Record<QuadrantId, number> {
  const dims = content.culture.dimensions
  const sums: Record<QuadrantId, number> = {
    clan: 0,
    adhocracy: 0,
    market: 0,
    hierarchy: 0,
  }
  for (const dim of dims) {
    const scores = input.culture[dim.id as keyof ScanInput['culture']]
    for (const q of QUADRANT_ORDER) sums[q] += scores[q]
  }
  const n = dims.length
  const profile: Record<QuadrantId, number> = {
    clan: sums.clan / n,
    adhocracy: sums.adhocracy / n,
    market: sums.market / n,
    hierarchy: sums.hierarchy / n,
  }
  return profile
}

export function dominantQuadrant(profile: Record<QuadrantId, number>): QuadrantId {
  let best: QuadrantId = 'clan'
  let bestV = -Infinity
  for (const q of QUADRANT_ORDER) {
    if (profile[q] > bestV) {
      bestV = profile[q]
      best = q
    }
  }
  return best
}

export function evaluateCulture(input: ScanInput, dominantPhase: PhaseId): CultureOutcome {
  const profile = cultureProfile(input)
  const values = QUADRANT_ORDER.map((q) => profile[q])
  const mx = Math.max(...values)
  const mn = Math.min(...values)
  const flat = mx - mn < content.culture.flatProfileThreshold
  const dominant = dominantQuadrant(profile)
  const expected = content.culture.expectedByPhase[dominantPhase] ?? []
  const tension = !flat && !expected.includes(dominant)

  return { profile, dominant, flat, tension }
}

export function quadrantLabel(id: QuadrantId): string {
  return content.culture.quadrants.find((q) => q.id === id)?.label ?? id
}
