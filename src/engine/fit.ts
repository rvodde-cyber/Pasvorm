import { content } from '../content'
import { phaseOrderOf } from './phase'
import type { BundleFitEntry, BundleId, InstrumentId, PhaseId, ScanInput, StageValue } from './types'

const instruments = content.instruments.instruments
const instrumentById = Object.fromEntries(instruments.map((i) => [i.id, i])) as Record<
  InstrumentId,
  (typeof instruments)[number]
>

function cumulativeRequirements(phaseId: PhaseId): Record<string, number> {
  const order = phaseOrderOf(phaseId)
  const out: Record<string, number> = {}
  for (const p of content.phases.phases) {
    if (p.order > order) continue
    const reqs = content.baseline.requirements[p.id] ?? {}
    for (const [instId, need] of Object.entries(reqs)) {
      out[instId] = Math.max(out[instId] ?? 0, need)
    }
  }
  return out
}

function applicable(instId: InstrumentId, size: number): boolean {
  const inst = instrumentById[instId]
  return inst.minSize === 0 || size >= inst.minSize
}

function getStage(input: ScanInput, id: InstrumentId): StageValue {
  return input.stages[id] ?? 0
}

function instrumentExpected(
  instId: InstrumentId,
  phaseId: PhaseId,
  size: number,
): number {
  const inst = instrumentById[instId]
  const cum = cumulativeRequirements(phaseId)[instId] ?? 0
  let legal = 0
  if (inst.legal && applicable(instId, size)) {
    legal = content.stages.legalMinimumStage
  }
  return Math.max(cum, legal)
}

function round1(x: number): number {
  return Math.round(x * 10) / 10
}

export function computeBundleFit(input: ScanInput, dominantPhase: PhaseId): Record<BundleId, BundleFitEntry> {
  const { shortfallThreshold, looseThreshold, looseExcludes } = content.baseline.bundleFit
  const legalMin = content.stages.legalMinimumStage
  const bundles: BundleId[] = ['basis', 'ability', 'motivation', 'opportunity', 'ethiek']
  const out: Record<BundleId, BundleFitEntry> = {} as Record<BundleId, BundleFitEntry>

  for (const bundle of bundles) {
    const insts = instruments.filter((i) => i.bundle === bundle)
    if (!insts.length) {
      out[bundle] = { measured: 0, expected: 0, status: 'past' }
      continue
    }

    const stages = insts.map((i) => getStage(input, i.id as InstrumentId))
    const measuredRaw = stages.reduce<number>((a, s) => a + s, 0) / insts.length
    const expectedPerInst = insts.map((i) => instrumentExpected(i.id as InstrumentId, dominantPhase, input.size))
    const expectedMeanRaw = expectedPerInst.reduce((a, e) => a + e, 0) / insts.length

    let shortfallRaw = 0
    let shortfallCount = 0
    for (let idx = 0; idx < insts.length; idx++) {
      const exp = expectedPerInst[idx]
      if (exp > 0) {
        shortfallRaw += Math.max(0, exp - stages[idx])
        shortfallCount++
      }
    }
    if (shortfallCount > 0) shortfallRaw /= shortfallCount
    else shortfallRaw = 0

    const legalShort = insts.some((inst, idx) => {
      const exp = expectedPerInst[idx]
      return inst.legal && exp > 0 && stages[idx] < legalMin
    })

    let status: BundleFitEntry['status']
    let reason: BundleFitEntry['reason']

    if (legalShort || shortfallRaw >= shortfallThreshold) {
      status = 'krap'
      reason = legalShort ? 'legal' : 'shortfall'
    } else if (
      !looseExcludes.includes(bundle) &&
      measuredRaw - expectedMeanRaw >= looseThreshold
    ) {
      status = 'ruim'
      reason = 'ruim'
    } else {
      status = 'past'
    }

    out[bundle] = {
      measured: round1(measuredRaw),
      expected: round1(expectedMeanRaw),
      status,
      ...(reason ? { reason } : {}),
    }
  }

  return out
}
