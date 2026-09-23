import type { BundleId } from '../data/bundles'
import { bundleById } from '../data/bundles'
import { instrumentById, instruments, type Instrument } from '../data/instruments'
import { phases } from '../data/phases'
import { type CvfScores, cvfShares, dominantCulture } from './culture'

export type RecommendationType = 'legal' | 'advies' | 'compleet'

export interface Recommendation {
  type: RecommendationType
  instrument?: Instrument
  priorityBundle: BundleId
  vervolg: Instrument[]
  vorm: string
}

const phasePriorityBundle: Record<number, BundleId> = {
  1: 'ability',
  2: 'opportunity',
  3: 'motivation',
  4: 'opportunity',
  5: 'ability',
}

const cultureVorm: Record<string, string> = {
  clan: 'als dialoog en persoonlijk gesprek',
  hierarchy: 'als vaste procedure en schriftelijk protocol',
  market: 'gekoppeld aan meetbare resultaten',
  adhocracy: 'als experiment of pilot',
}

function isPresent(present: Record<string, boolean>, id: string): boolean {
  return !!present[id]
}

function visibleInstrument(inst: Instrument, size: number): boolean {
  if (inst.minSize === 0) return true
  if (size === 0) return true
  return size >= inst.minSize
}

export function bundleStrength(
  bundleId: BundleId,
  present: Record<string, boolean>,
): number {
  const insts = instruments.filter((i) => i.bundle === bundleId)
  if (!insts.length) return 0
  const score = insts.filter((i) => isPresent(present, i.id)).length
  return Math.round((score / insts.length) * 100)
}

export function buildRecommendation(
  phaseId: number,
  cvfScores: CvfScores,
  present: Record<string, boolean>,
  orgSize: number,
): Recommendation {
  const priorityBundle = phasePriorityBundle[phaseId] ?? 'ability'
  const dom = dominantCulture(cvfScores)
  const vorm = dom ? cultureVorm[dom.id] : ''

  const legalMissing = instruments.filter(
    (i) =>
      i.legal &&
      !isPresent(present, i.id) &&
      visibleInstrument(i, orgSize),
  )

  if (legalMissing.length > 0) {
    return {
      type: 'legal',
      instrument: legalMissing[0],
      priorityBundle,
      vervolg: [],
      vorm,
    }
  }

  let candidates = instruments.filter(
    (i) => i.bundle === priorityBundle && !isPresent(present, i.id),
  )
  if (candidates.length === 0) {
    candidates = instruments.filter((i) => i.bundle !== 'basis' && !isPresent(present, i.id))
  }

  candidates.sort((a, b) => {
    const sa = a.reinforces.filter((r) => isPresent(present, r)).length
    const sb = b.reinforces.filter((r) => isPresent(present, r)).length
    return sb - sa
  })

  if (candidates.length === 0) {
    return { type: 'compleet', priorityBundle, vervolg: [], vorm }
  }

  const anchor = candidates[0]
  const vervolg = (anchor.reinforces ?? [])
    .filter((r) => !isPresent(present, r) && instrumentById[r] && r !== anchor.id)
    .slice(0, 2)
    .map((r) => instrumentById[r])

  return {
    type: 'advies',
    instrument: anchor,
    priorityBundle,
    vervolg,
    vorm,
  }
}

export function phaseById(id: number) {
  return phases.find((p) => p.id === id) ?? phases[0]
}

export function recommendationBundleLabel(rec: Recommendation): string {
  return bundleById[rec.priorityBundle].label
}

export function cultureSharePercent(scores: CvfScores, cultureId: string): number {
  return Math.round(cvfShares(scores)[cultureId as keyof ReturnType<typeof cvfShares>] * 100)
}
