import { describe, expect, it } from 'vitest'
import { scanExample } from '../src/data/example'
import { instruments } from '../src/data/instruments'
import type { CvfScores } from '../src/utils/culture'
import { buildRecommendation } from '../src/utils/recommendation'

// Vastleggingstests: leggen het huidige gedrag van buildRecommendation vast, niet het gewenste.

const legalBasis = Object.fromEntries(
  instruments.filter((i) => i.legal).map((i) => [i.id, true]),
) as Record<string, boolean>

const without = (present: Record<string, boolean>, id: string) => {
  const next = { ...present }
  delete next[id]
  return next
}

const hierarchyDominant: CvfScores = { clan: 2, adhocracy: 1, market: 2, hierarchy: 5 }

describe('buildRecommendation', () => {
  it('a. voorbeeld schoonmaakbedrijf (200 mw) uit de introstap', () => {
    const rec = buildRecommendation(
      scanExample.phaseId,
      scanExample.cvfScores,
      scanExample.present,
      parseInt(scanExample.size, 10),
    )

    expect(rec.type).toBe('advies')
    expect(rec.priorityBundle).toBe('opportunity')
    expect(rec.instrument?.id).toBe('werkoverleg')
    expect(rec.vervolg.map((i) => i.id)).toEqual(['interne_communicatie', 'erkenning'])
    expect(rec.vorm).toBe('als vaste procedure en schriftelijk protocol')
  })

  it('b. taxibedrijf: 400 mw, fase 1, hiërarchie dominant, alleen wettelijke basis', () => {
    const rec = buildRecommendation(1, hierarchyDominant, legalBasis, 400)

    expect(rec.type).toBe('advies')
    expect(rec.priorityBundle).toBe('ability')
    expect(rec.instrument?.id).toBe('onboarding')
    expect(rec.vervolg.map((i) => i.id)).toEqual(['gesprekscyclus', 'werving_selectie'])
    expect(rec.vorm).toBe('als vaste procedure en schriftelijk protocol')
  })

  it("c. 30 mw zonder RI&E: advies van het type 'legal', RI&E", () => {
    const present = without(without(legalBasis, 'rie'), 'medezeggenschap')
    const rec = buildRecommendation(1, hierarchyDominant, present, 30)

    expect(rec.type).toBe('legal')
    expect(rec.instrument?.id).toBe('rie')
    expect(rec.vervolg).toEqual([])
  })

  it('d. 30 mw zonder OR: OR wordt niet geëist (drempel 50)', () => {
    const present = without(legalBasis, 'medezeggenschap')

    const small = buildRecommendation(1, hierarchyDominant, present, 30)
    expect(small.type).not.toBe('legal')
    expect(small.instrument?.id).not.toBe('medezeggenschap')

    const atThreshold = buildRecommendation(1, hierarchyDominant, present, 50)
    expect(atThreshold.type).toBe('legal')
    expect(atThreshold.instrument?.id).toBe('medezeggenschap')
  })

  it("e. alle 24 instrumenten aanwezig: type 'compleet'", () => {
    expect(instruments).toHaveLength(24)
    const all = Object.fromEntries(instruments.map((i) => [i.id, true]))
    const rec = buildRecommendation(1, hierarchyDominant, all, 200)

    expect(rec.type).toBe('compleet')
    expect(rec.instrument).toBeUndefined()
    expect(rec.vervolg).toEqual([])
  })
})
