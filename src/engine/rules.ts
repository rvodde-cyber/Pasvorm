import { content } from '../content'
import { evaluateCulture, quadrantLabel } from './culture'
import { computeBundleFit } from './fit'
import { evaluatePhase, phaseIdByOrder, phaseName, phaseOrderOf } from './phase'
import type {
  BundleId,
  EvaluateResult,
  InstrumentId,
  MmvId,
  MmvScore,
  PriorityItem,
  PriorityRuleId,
  ScanInput,
  SignalItem,
  StageValue,
  TemporaryItem,
} from './types'

const instruments = content.instruments.instruments
const instrumentById = Object.fromEntries(instruments.map((i) => [i.id, i])) as Record<
  InstrumentId,
  (typeof instruments)[number]
>
const instrumentIndex = Object.fromEntries(instruments.map((i, idx) => [i.id, idx])) as Record<
  InstrumentId,
  number
>

const stageLabel = Object.fromEntries(content.stages.stages.map((s) => [s.value, s.label])) as Record<
  StageValue,
  string
>

const ruleMeta = Object.fromEntries(content.rules.rules.map((r) => [r.id, r])) as Record<
  string,
  (typeof content.rules.rules)[number]
>

function getStage(input: ScanInput, id: InstrumentId): StageValue {
  return input.stages[id] ?? 0
}

function getMmvScore(input: ScanInput, id: MmvId): MmvScore {
  return input.mmv[id] ?? 4
}

function applicable(instId: InstrumentId, size: number): boolean {
  const inst = instrumentById[instId]
  return inst.minSize === 0 || size >= inst.minSize
}

function cumulativeRequirements(phaseId: import('./types').PhaseId): Record<string, number> {
  const order = phaseOrderOf(phaseId)
  const out: Record<string, number> = {}
  for (const p of content.phases.phases) {
    if (p.order <= order) Object.assign(out, content.baseline.requirements[p.id])
  }
  return out
}

function sortKey(
  instId: InstrumentId,
  input: ScanInput,
  priority: string[],
): [number, number, number] {
  const inst = instrumentById[instId]
  const reinforces = inst.reinforces.filter((r) => getStage(input, r as InstrumentId) >= 2).length
  return [priority.includes(instId) ? 0 : 1, -reinforces, instrumentIndex[instId]]
}

function compareInst(
  a: InstrumentId,
  b: InstrumentId,
  input: ScanInput,
  priority: string[],
): number {
  const ka = sortKey(a, input, priority)
  const kb = sortKey(b, input, priority)
  for (let i = 0; i < 3; i++) {
    if (ka[i] !== kb[i]) return ka[i] - kb[i]
  }
  return 0
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`)
}

function ruleWhy(
  ruleId: PriorityRuleId,
  vars: Record<string, string>,
): string {
  const why = ruleMeta[ruleId]?.why
  return why ? fillTemplate(why, vars) : ''
}

function buildPriority(
  instId: InstrumentId,
  rule: PriorityRuleId,
  form: import('./types').QuadrantId | null,
  extra: Record<string, string>,
): PriorityItem {
  const inst = instrumentById[instId]
  const meta = ruleMeta[rule]
  const why = ruleWhy(rule, extra)
  const item: PriorityItem = {
    instrumentId: instId,
    rule,
    kind: meta?.kind ?? rule,
    horizon: meta?.horizon ?? '',
    why,
    sourceIds: [...(meta?.sourceIds ?? []), ...inst.sourceIds].filter(
      (id, idx, arr) => arr.indexOf(id) === idx,
    ),
    firstStep: inst.firstStep,
  }
  if (form && !inst.legal) {
    item.formSentence = content.culture.formSentences[form]
  }
  return item
}

function firstPhaseForInstrument(instId: InstrumentId): number | null {
  let best = Infinity
  for (const p of content.phases.phases) {
    if (instId in (content.baseline.requirements[p.id] ?? {})) {
      best = Math.min(best, p.order)
    }
  }
  return best === Infinity ? null : best
}

export function evaluate(input: ScanInput): EvaluateResult {
  const phase = evaluatePhase(input)
  const culture = evaluateCulture(input, phase.dominant)
  const workforce = content.context.workforce.options.find((o) => o.id === input.workforce)!
  const future = content.context.future.options.find((o) => o.id === input.future)!
  const priorityList = workforce.priority

  const stages: Record<InstrumentId, StageValue> = Object.fromEntries(
    instruments.map((i) => [i.id, getStage(input, i.id as InstrumentId)]),
  ) as Record<InstrumentId, StageValue>

  const legalMin = content.stages.legalMinimumStage

  const r1: InstrumentId[] = instruments
    .filter(
      (i) =>
        i.legal &&
        applicable(i.id as InstrumentId, input.size) &&
        stages[i.id as InstrumentId] < legalMin,
    )
    .map((i) => i.id as InstrumentId)

  const used = new Set<string>(r1)
  const r5: InstrumentId[] = []
  for (const pair of content.pairs.pairs) {
    const a = stages[pair.a as InstrumentId]
    const b = stages[pair.b as InstrumentId]
    if (Math.max(a, b) > 0 && Math.abs(a - b) >= content.pairs.gapThreshold) {
      const weaker = a < b ? (pair.a as InstrumentId) : (pair.b as InstrumentId)
      if (!used.has(weaker) && !r5.includes(weaker)) r5.push(weaker)
    }
  }

  const req = cumulativeRequirements(phase.dominant)
  const r2 = Object.entries(req)
    .filter(([id, need]) => stages[id as InstrumentId] < need && !used.has(id) && !r5.includes(id as InstrumentId))
    .map(([id]) => id as InstrumentId)
    .sort((a, b) => compareInst(a, b, input, priorityList))

  let r2b: InstrumentId[] = []
  if (phase.transition) {
    const nextPhase = phaseIdByOrder(phaseOrderOf(phase.dominant) + 1)
    const nextReq = content.baseline.requirements[nextPhase] ?? {}
    r2b = Object.entries(nextReq)
      .filter(
        ([id, need]) =>
          stages[id as InstrumentId] < need &&
          !used.has(id) &&
          !r5.includes(id as InstrumentId) &&
          !r2.includes(id as InstrumentId),
      )
      .map(([id]) => id as InstrumentId)
      .sort((a, b) => compareInst(a, b, input, priorityList))
  }

  const fill: Array<[InstrumentId, PriorityRuleId]> = [
    ...r5.map((id): [InstrumentId, PriorityRuleId] => [id, 'R5']),
    ...r2.map((id): [InstrumentId, PriorityRuleId] => [id, 'R2']),
    ...r2b.map((id): [InstrumentId, PriorityRuleId] => [id, 'R2b']),
  ]

  const priorityPairs: Array<[InstrumentId, PriorityRuleId]> = [
    ...r1.map((id): [InstrumentId, PriorityRuleId] => [id, 'R1']),
  ]
  while (priorityPairs.length < content.rules.maxPriorities && fill.length > 0) {
    priorityPairs.push(fill.shift()!)
  }

  const sufficient = r1.length === 0 && r5.length === 0 && r2.length === 0

  const form = culture.flat ? null : culture.dominants[0]

  const pairReasonByInst = new Map<InstrumentId, string>()
  for (const pair of content.pairs.pairs) {
    const a = stages[pair.a as InstrumentId]
    const b = stages[pair.b as InstrumentId]
    if (Math.max(a, b) > 0 && Math.abs(a - b) >= content.pairs.gapThreshold) {
      const weaker = a < b ? (pair.a as InstrumentId) : (pair.b as InstrumentId)
      pairReasonByInst.set(weaker, pair.reason)
    }
  }

  const nextPhaseId = phase.transition
    ? phaseIdByOrder(phaseOrderOf(phase.dominant) + 1)
    : phase.dominant
  const priorities: PriorityItem[] = priorityPairs.map(([instId, rule]) => {
    const need = req[instId] ?? content.baseline.requirements[nextPhaseId]?.[instId]
    const vars: Record<string, string> = {
      reason: pairReasonByInst.get(instId) ?? '',
      phase: phaseName(phase.dominant),
      expected: need != null ? stageLabel[need as StageValue] : '',
      current: stageLabel[stages[instId]],
      nextPhase: phaseName(nextPhaseId),
      scenario: future.title,
    }
    return buildPriority(instId, rule, form, vars)
  })

  const priorityIds = new Set(priorities.map((p) => p.instrumentId))
  const r3Meta = ruleMeta.R3
  const temporarySorted = future.temporarySet
    .filter(
      (id) =>
        applicable(id as InstrumentId, input.size) &&
        stages[id as InstrumentId] < 2 &&
        !priorityIds.has(id as InstrumentId),
    )
    .sort((a, b) => compareInst(a as InstrumentId, b as InstrumentId, input, priorityList))
    .slice(0, content.context.future.maxTemporary)

  const temporary: TemporaryItem[] = temporarySorted.map((id) => ({
    instrumentId: id as InstrumentId,
    why: fillTemplate(r3Meta?.why ?? '', { scenario: future.title }),
    horizon: r3Meta?.horizon ?? '',
  }))

  const external = [...future.external]

  const signals: SignalItem[] = []
  if (phase.transition) {
    signals.push({
      id: 'transition',
      text: fillTemplate(content.rules.signals.transition, {
        phase: phaseName(phase.dominant),
        nextPhase: phaseName(phase.second),
      }),
    })
  }
  if (phase.inconsistent) {
    signals.push({
      id: 'inconsistentPhase',
      text: fillTemplate(content.rules.signals.inconsistentPhase, {
        first: phaseName(phase.dominant),
        second: phaseName(phase.second),
      }),
    })
  }
  if (culture.flat) {
    signals.push({ id: 'flatProfile', text: content.rules.signals.flatProfile })
  } else if (culture.tension) {
    signals.push({
      id: 'phaseCultureTension',
      text: fillTemplate(content.rules.signals.phaseCultureTension, {
        culture: quadrantLabel(culture.dominant),
        phase: phaseName(phase.dominant),
      }),
    })
  }

  for (const inst of instruments) {
    const id = inst.id as InstrumentId
    if (inst.legal || stages[id] < 3) continue
    const firstPhase = firstPhaseForInstrument(id)
    if (firstPhase == null) continue
    if (firstPhase - phaseOrderOf(phase.dominant) >= content.baseline.overweightPhaseDistance) {
      signals.push({
        id: 'overweight',
        instrumentId: id,
        text: fillTemplate(content.rules.signals.overweight, { instrument: inst.label }),
      })
    }
  }

  const ethicsNotes: EvaluateResult['ethicsNotes'] = []
  for (const item of content.mmv.items) {
    const score = getMmvScore(input, item.id as MmvId)
    if (score <= content.mmv.lowThreshold) {
      ethicsNotes.push({
        instrumentId: item.instrumentId as InstrumentId,
        mmvId: item.id as MmvId,
        note: item.note,
      })
      if (stages[item.instrumentId as InstrumentId] >= 2) {
        signals.push({
          id: 'paperNoPractice',
          instrumentId: item.instrumentId as InstrumentId,
          text: fillTemplate(content.rules.signals.paperNoPractice, {
            instrument: instrumentById[item.instrumentId as InstrumentId].label,
          }),
        })
      }
    }
  }

  const bundleScores: Record<BundleId, number> = {
    basis: 0,
    ability: 0,
    motivation: 0,
    opportunity: 0,
    ethiek: 0,
  }
  for (const bundle of Object.keys(bundleScores) as BundleId[]) {
    const insts = instruments.filter((i) => i.bundle === bundle)
    if (!insts.length) {
      bundleScores[bundle] = 0
      continue
    }
    const sum = insts.reduce((acc, i) => acc + stages[i.id as InstrumentId], 0)
    bundleScores[bundle] = Math.round((sum / insts.length) * 10) / 10
  }

  const mmvScores = Object.fromEntries(
    content.mmv.items.map((m) => [m.id, getMmvScore(input, m.id as MmvId)]),
  ) as Record<MmvId, MmvScore>

  const bundleFit = computeBundleFit(input, phase.dominant)

  const result: EvaluateResult = {
    phase,
    culture,
    priorities,
    sufficient,
    sufficientText: sufficient ? content.rules.texts.sufficient : undefined,
    temporary,
    external,
    form,
    signals,
    ethicsNotes,
    bundleScores,
    bundleFit,
    mmvScores,
  }

  if (input.workforce === 'gemengd' && workforce.reportNote) result.workforceNote = workforce.reportNote
  if (input.future === 'anders') {
    result.futureNote = input.futureNote?.trim()
      ? input.futureNote
      : future.reportNote
  }

  return result
}
