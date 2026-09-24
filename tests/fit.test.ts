import { describe, expect, it } from 'vitest'
import { evaluate } from '../src/engine'
import type { BundleId, QuadrantId, ScanInput } from '../src/engine/types'
import testcases from './fixtures/testcases.json'

type FixtureCase = (typeof testcases.cases)[number]

function profileToCulture(profile: Record<QuadrantId, number>): ScanInput['culture'] {
  return { d1: profile, d2: profile, d3: profile }
}

function fixtureToScanInput(raw: FixtureCase['input']): ScanInput {
  return {
    size: raw.size,
    phaseChoices: raw.phaseChoices as ScanInput['phaseChoices'],
    crisis: (raw.crisis ?? {}) as ScanInput['crisis'],
    culture: profileToCulture(raw.culture as Record<QuadrantId, number>),
    future: raw.future as ScanInput['future'],
    workforce: raw.workforce as ScanInput['workforce'],
    stages: (raw.stages ?? {}) as ScanInput['stages'],
    mmv: (raw.mmv ?? {}) as ScanInput['mmv'],
  }
}

type Gold = { measured: number; expected: number; status: 'krap' | 'past' | 'ruim'; reason?: string }

const gold: Record<string, Record<BundleId, Gold>> = {
  T1: {
    basis: { measured: 3.0, expected: 2.0, status: 'past' },
    ability: { measured: 0.0, expected: 0.2, status: 'krap' },
    motivation: { measured: 0.0, expected: 0.2, status: 'krap' },
    opportunity: { measured: 0.0, expected: 0.3, status: 'krap' },
    ethiek: { measured: 0.0, expected: 0.5, status: 'krap', reason: 'legal' },
  },
  T2: {
    basis: { measured: 3.0, expected: 2.0, status: 'past' },
    ability: { measured: 0.0, expected: 1.2, status: 'krap' },
    motivation: { measured: 0.0, expected: 0.6, status: 'krap' },
    opportunity: { measured: 0.0, expected: 0.5, status: 'krap' },
    ethiek: { measured: 0.0, expected: 1.0, status: 'krap', reason: 'legal' },
  },
  T3: {
    basis: { measured: 1.7, expected: 1.7, status: 'krap', reason: 'legal' },
    ability: { measured: 0.8, expected: 0.2, status: 'past' },
    motivation: { measured: 0.2, expected: 0.2, status: 'past' },
    opportunity: { measured: 0.3, expected: 0.3, status: 'past' },
    ethiek: { measured: 0.0, expected: 0.0, status: 'past' },
  },
  T4: {
    basis: { measured: 3.0, expected: 1.7, status: 'past' },
    ability: { measured: 1.4, expected: 1.2, status: 'past' },
    motivation: { measured: 0.8, expected: 0.6, status: 'past' },
    opportunity: { measured: 0.8, expected: 0.5, status: 'past' },
    ethiek: { measured: 0.8, expected: 0.5, status: 'past' },
  },
  T5: {
    basis: { measured: 3.0, expected: 1.7, status: 'past' },
    ability: { measured: 1.2, expected: 1.2, status: 'past' },
    motivation: { measured: 0.8, expected: 0.6, status: 'past' },
    opportunity: { measured: 0.8, expected: 0.5, status: 'past' },
    ethiek: { measured: 0.8, expected: 0.5, status: 'past' },
  },
  T6: {
    basis: { measured: 3.0, expected: 2.0, status: 'past' },
    ability: { measured: 3.0, expected: 2.0, status: 'past' },
    motivation: { measured: 3.0, expected: 2.0, status: 'past' },
    opportunity: { measured: 3.0, expected: 1.5, status: 'ruim', reason: 'ruim' },
    ethiek: { measured: 3.0, expected: 1.8, status: 'past' },
  },
  T7: {
    basis: { measured: 3.0, expected: 1.7, status: 'past' },
    ability: { measured: 1.4, expected: 1.2, status: 'past' },
    motivation: { measured: 0.8, expected: 0.6, status: 'past' },
    opportunity: { measured: 0.8, expected: 0.5, status: 'past' },
    ethiek: { measured: 1.0, expected: 0.5, status: 'past' },
  },
  T8: {
    basis: { measured: 0.0, expected: 2.0, status: 'krap', reason: 'legal' },
    ability: { measured: 0.0, expected: 0.2, status: 'krap' },
    motivation: { measured: 0.0, expected: 0.2, status: 'krap' },
    opportunity: { measured: 0.0, expected: 0.3, status: 'krap' },
    ethiek: { measured: 0.0, expected: 0.5, status: 'krap', reason: 'legal' },
  },
}

describe('bundleFit', () => {
  for (const tc of testcases.cases) {
    it(`${tc.id} komt overeen met goudwaarden`, () => {
      const result = evaluate(fixtureToScanInput(tc.input))
      const expected = gold[tc.id]
      expect(expected).toBeDefined()
      for (const bundle of Object.keys(expected) as BundleId[]) {
        const fit = result.bundleFit[bundle]
        const g = expected[bundle]
        expect(fit.measured).toBe(g.measured)
        expect(fit.expected).toBe(g.expected)
        expect(fit.status).toBe(g.status)
        if (g.reason) {
          expect(fit.reason).toBe(g.reason)
        } else if (g.status === 'krap') {
          expect(fit.reason).toBe('shortfall')
        } else if (g.status === 'ruim') {
          expect(fit.reason).toBe('ruim')
        } else {
          expect(fit.reason).toBeUndefined()
        }
      }
    })
  }
})
