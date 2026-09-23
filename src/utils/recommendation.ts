import type { CultureId } from '../data/cvf'
import type { BundleId } from '../data/bundles'
import { bundleById } from '../data/bundles'
import { instrumentById, instruments, type Instrument } from '../data/instruments'

export type RecommendationType = 'legal' | 'phase' | 'anchor' | 'follow-up'

export interface Recommendation {
  type: RecommendationType
  instrument: Instrument
  priorityBundle: BundleId
  vervolg: Instrument[]
  vorm: string
  conflict?: string
}

const phasePriorityBundle: Record<number, BundleId> = {
  1: 'ability',
  2: 'opportunity',
  3: 'motivation',
  4: 'opportunity',
  5: 'ability',
}

const cultureVorm: Record<CultureId, string> = {
  clan: 'als dialoog en persoonlijk gesprek',
  hierarchy: 'als vaste procedure en schriftelijk protocol',
  market: 'gekoppeld aan meetbare resultaten',
  adhocracy: 'als experiment of pilot',
}

function missingInstruments(present: Set<string>): Instrument[] {
  return instruments.filter((i) => !present.has(i.id))
}

function countReinforcesToPresent(inst: Instrument, present: Set<string>): number {
  return inst.reinforces.filter((id) => present.has(id) && id in instrumentById).length
}

function pickFromBundle(
  pool: Instrument[],
  bundle: BundleId,
  exclude: Set<string>,
): Instrument | undefined {
  return pool.find((i) => i.bundle === bundle && !exclude.has(i.id))
}

function detectConflict(inst: Instrument, culture: CultureId): string | undefined {
  if (culture === 'clan' && inst.legal) {
    return undefined
  }
  if (culture === 'adhocracy' && inst.bundle === 'basis' && inst.legal) {
    return 'Formele compliance vraagt om structuur — combineer een pilot met duidelijke minimumnormen.'
  }
  if (culture === 'market' && inst.id === 'medezeggenschap') {
    return 'Inspraak en resultaatdruk vragen om expliciete KPI’s én participatiemomenten.'
  }
  if (culture === 'hierarchy' && inst.id === 'kennisdeling') {
    return 'Kennisdeling vraagt om ruimte naast procedures — plan vaste informele momenten.'
  }
  return undefined
}

export function buildRecommendation(
  phaseId: number,
  cultureId: CultureId,
  presentIds: string[],
): Recommendation {
  const present = new Set(presentIds)
  const missing = missingInstruments(present)
  const priorityBundle = phasePriorityBundle[phaseId] ?? 'ability'
  const vorm = cultureVorm[cultureId]
  const used = new Set<string>()

  const legalMissing = missing.filter((i) => i.legal)
  let primary: Instrument
  let type: RecommendationType

  if (legalMissing.length > 0) {
    primary = legalMissing[0]
    type = 'legal'
  } else {
    const phasePick = pickFromBundle(missing, priorityBundle, used)
    if (phasePick) {
      primary = phasePick
      type = 'phase'
    } else {
      const anchorCandidates = missing
        .map((i) => ({ i, score: countReinforcesToPresent(i, present) }))
        .sort((a, b) => b.score - a.score)
      primary = anchorCandidates[0]?.i ?? missing[0] ?? instruments[0]
      type = 'anchor'
    }
  }

  used.add(primary.id)

  const vervolgPool = missing.filter((i) => !used.has(i.id))
  const vervolg: Instrument[] = []

  const phaseSecond = pickFromBundle(vervolgPool, priorityBundle, used)
  if (phaseSecond) {
    vervolg.push(phaseSecond)
    used.add(phaseSecond.id)
  }

  const anchorSorted = vervolgPool
    .filter((i) => !used.has(i.id))
    .map((i) => ({ i, score: countReinforcesToPresent(i, present) }))
    .sort((a, b) => b.score - a.score)

  if (vervolg.length < 2 && anchorSorted[0]) {
    vervolg.push(anchorSorted[0].i)
    used.add(anchorSorted[0].i.id)
  }

  while (vervolg.length < 2 && vervolgPool.length > 0) {
    const next = vervolgPool.find((i) => !used.has(i.id))
    if (!next) break
    vervolg.push(next)
    used.add(next.id)
  }

  const conflict = detectConflict(primary, cultureId)

  return {
    type,
    instrument: primary,
    priorityBundle,
    vervolg: vervolg.slice(0, 2),
    vorm,
    conflict,
  }
}

export function recommendationHeadline(rec: Recommendation): string {
  const bundleLabel = bundleById[rec.priorityBundle].label
  switch (rec.type) {
    case 'legal':
      return 'Eerst wettelijke basis regelen'
    case 'phase':
      return `Prioriteit voor ${bundleLabel}`
    case 'anchor':
      return 'Ankerinstrument — versterkt wat al staat'
    default:
      return 'Vervolgstap'
  }
}
