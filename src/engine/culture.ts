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

export function dominantQuadrants(profile: Record<QuadrantId, number>): QuadrantId[] {
  const mx = Math.max(...QUADRANT_ORDER.map((q) => profile[q]))
  return QUADRANT_ORDER.filter((q) => profile[q] === mx)
}

export function evaluateCulture(input: ScanInput, dominantPhase: PhaseId): CultureOutcome {
  const profile = cultureProfile(input)
  const values = QUADRANT_ORDER.map((q) => profile[q])
  const mx = Math.max(...values)
  const mn = Math.min(...values)
  const flat = mx - mn < content.culture.flatProfileThreshold
  const dominants = dominantQuadrants(profile)
  const dominant = dominants[0]
  const expected = content.culture.expectedByPhase[dominantPhase] ?? []
  const tension = !flat && !dominants.some((q) => expected.includes(q))

  return { profile, dominant, dominants, flat, tension }
}

export function quadrantLabel(id: QuadrantId): string {
  return content.culture.quadrants.find((q) => q.id === id)?.label ?? id
}
