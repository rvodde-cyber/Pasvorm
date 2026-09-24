import { describe, expect, it } from 'vitest'
import { content } from '../src/content'
import {
  instrumentsFileSchema,
  parseContentFile,
  validateContentReferences,
  type ContentBundle,
} from '../src/content/schema'
import { evaluate } from '../src/engine'
import type { QuadrantId, ScanInput } from '../src/engine/types'
import testcases from './fixtures/testcases.json'

type FixtureCase = (typeof testcases.cases)[number]

function profileToCulture(profile: Record<QuadrantId, number>): ScanInput['culture'] {
  const out: ScanInput['culture'] = { d1: profile, d2: profile, d3: profile }
  return out
}

function fixtureToScanInput(raw: FixtureCase['input']): ScanInput {
  return {
    size: raw.size,
    phaseChoices: raw.phaseChoices as ScanInput['phaseChoices'],
    crisis: (raw.crisis ?? {}) as ScanInput['crisis'],
    culture: profileToCulture(raw.culture as Record<QuadrantId, number>),
    future: raw.future as ScanInput['future'],
    futureNote:
      'futureNote' in raw && typeof (raw as { futureNote?: string }).futureNote === 'string'
        ? (raw as { futureNote: string }).futureNote
        : undefined,
    workforce: raw.workforce as ScanInput['workforce'],
    stages: (raw.stages ?? {}) as ScanInput['stages'],
    mmv: (raw.mmv ?? {}) as ScanInput['mmv'],
  }
}

function signalKey(s: { id: string; instrumentId?: string }): string {
  return s.instrumentId ? `${s.id}:${s.instrumentId}` : s.id
}

describe('content schema', () => {
  it('valideert alle JSON-bestanden bij laden', () => {
    expect(content.instruments.instruments.length).toBeGreaterThan(0)
    expect(content.rules.maxPriorities).toBe(3)
  })

  it('geeft een duidelijke fout bij een kapot bestand', () => {
    expect(() =>
      parseContentFile('instruments.json', instrumentsFileSchema, { version: '1.0' }),
    ).toThrow(/^instruments\.json:/)
  })

  it('controleert verwijzingen tussen bestanden', () => {
    const broken: ContentBundle = {
      ...content,
      instruments: {
        ...content.instruments,
        instruments: [
          {
            ...content.instruments.instruments[0],
            reinforces: ['onbekend_instrument'],
          },
        ],
      },
    }
    expect(() => validateContentReferences(broken)).toThrow(/onbekend instrumentId/)
  })
})

describe('evaluate (regelmotor v1.0)', () => {
  for (const tc of testcases.cases) {
    it(`${tc.id} — ${tc.name}`, () => {
      const result = evaluate(fixtureToScanInput(tc.input))
      const exp = tc.expected

      expect(result.priorities.map((p) => ({ instrumentId: p.instrumentId, rule: p.rule }))).toEqual(
        exp.priorities,
      )
      expect(result.sufficient).toBe(exp.sufficient)
      expect(result.temporary.map((t) => t.instrumentId)).toEqual(exp.temporary)
      expect(result.external).toEqual(exp.external)
      expect(result.form).toBe(exp.form)
      expect(result.signals.map(signalKey)).toEqual(exp.signals)
      expect(result.ethicsNotes.map((n) => n.instrumentId)).toEqual(exp.ethicsNotes)
    })
  }
})
