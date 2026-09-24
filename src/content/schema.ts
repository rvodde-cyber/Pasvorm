import { z } from 'zod'

export const quadrantIdSchema = z.enum(['clan', 'adhocracy', 'market', 'hierarchy'])
export const phaseIdSchema = z.enum(['f1', 'f2', 'f3', 'f4', 'f5'])
export const bundleIdSchema = z.enum(['basis', 'ability', 'motivation', 'opportunity', 'ethiek'])

const quadrantItemsSchema = z.object({
  clan: z.string(),
  adhocracy: z.string(),
  market: z.string(),
  hierarchy: z.string(),
})

export const instrumentsFileSchema = z.object({
  version: z.string(),
  instruments: z.array(
    z.object({
      id: z.string().min(1),
      bundle: bundleIdSchema,
      label: z.string(),
      description: z.string(),
      legal: z.boolean(),
      minSize: z.number().int().min(0),
      reinforces: z.array(z.string()),
      sourceIds: z.array(z.string()),
      firstStep: z.string(),
    }),
  ),
})

export const phasesFileSchema = z.object({
  version: z.string(),
  sourceIds: z.array(z.string()),
  question: z.string(),
  phases: z.array(
    z.object({
      id: phaseIdSchema,
      order: z.number().int().positive(),
      name: z.string(),
      vignette: z.string(),
    }),
  ),
  crisisQuestion: z.string(),
  crisisAnswers: z.array(z.object({ id: z.string(), label: z.string() })),
  crisisSignals: z.array(
    z.object({
      id: z.string(),
      phaseId: phaseIdSchema,
      crisis: z.string(),
      statement: z.string(),
    }),
  ),
})

export const baselineFileSchema = z.object({
  version: z.string(),
  sourceIds: z.array(z.string()),
  cumulative: z.boolean(),
  overweightPhaseDistance: z.number().int().min(0),
  requirements: z.record(phaseIdSchema, z.record(z.string(), z.number().int().min(0).max(3))),
})

export const pairsFileSchema = z.object({
  version: z.string(),
  sourceIds: z.array(z.string()),
  gapThreshold: z.number().int().positive(),
  pairs: z.array(
    z.object({
      id: z.string(),
      a: z.string(),
      b: z.string(),
      reason: z.string(),
    }),
  ),
})

export const cultureFileSchema = z.object({
  version: z.string(),
  sourceIds: z.array(z.string()),
  question: z.string(),
  quadrants: z.array(z.object({ id: quadrantIdSchema, label: z.string() })),
  dimensions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      items: quadrantItemsSchema,
    }),
  ),
  pointsPerDimension: z.number().int().positive(),
  flatProfileThreshold: z.number().nonnegative(),
  expectedByPhase: z.record(phaseIdSchema, z.array(quadrantIdSchema)),
  formSentences: z.record(quadrantIdSchema, z.string()),
})

export const contextFileSchema = z.object({
  version: z.string(),
  future: z.object({
    sourceIds: z.array(z.string()),
    question: z.string(),
    options: z.array(
      z.object({
        id: z.enum(['groei', 'gelijk', 'afbouw', 'anders']),
        title: z.string(),
        description: z.string(),
        temporarySet: z.array(z.string()),
        external: z.array(z.string()),
        hasNote: z.boolean().optional(),
        reportNote: z.string().optional(),
      }),
    ),
    maxTemporary: z.number().int().min(0),
  }),
  workforce: z.object({
    sourceIds: z.array(z.string()),
    question: z.string(),
    options: z.array(
      z.object({
        id: z.enum(['uitvoerend', 'vakmanschap', 'schaars', 'gemengd']),
        title: z.string(),
        description: z.string(),
        priority: z.array(z.string()),
        reportNote: z.string().optional(),
      }),
    ),
  }),
})

export const mmvFileSchema = z.object({
  version: z.string(),
  sourceIds: z.array(z.string()),
  question: z.string(),
  scale: z.object({
    min: z.number().int(),
    max: z.number().int(),
    minLabel: z.string(),
    maxLabel: z.string(),
  }),
  lowThreshold: z.number().int(),
  items: z.array(
    z.object({
      id: z.string(),
      phase: z.string(),
      color: z.string(),
      statement: z.string(),
      instrumentId: z.string(),
      note: z.string(),
    }),
  ),
})

export const stagesFileSchema = z.object({
  version: z.string(),
  stages: z.array(
    z.object({
      value: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      label: z.string(),
      description: z.string(),
    }),
  ),
  legalMinimumStage: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
})

export const sourcesFileSchema = z.object({
  version: z.string(),
  sources: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      apa: z.string(),
    }),
  ),
})

export const bundlesFileSchema = z.object({
  version: z.string(),
  sourceIds: z.array(z.string()),
  bundles: z.array(
    z.object({
      id: bundleIdSchema,
      label: z.string(),
      subtitle: z.string(),
      description: z.string(),
    }),
  ),
})

export const uiFileSchema = z.object({
  version: z.string(),
  progressLabel: z.string(),
  nav: z.object({
    back: z.string(),
    next: z.string(),
    toResult: z.string(),
    example: z.string(),
    exampleCaseId: z.string(),
    clear: z.string(),
    clearConfirm: z.string(),
    clearYes: z.string(),
    clearCancel: z.string(),
    savedHint: z.string(),
  }),
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      intro: z.string(),
      fields: z
        .object({
          orgName: z.object({
            label: z.string(),
            hint: z.string(),
            placeholder: z.string(),
          }),
          size: z.object({
            label: z.string(),
            hint: z.string(),
            placeholder: z.string(),
            error: z.string(),
          }),
        })
        .optional(),
      firstBadge: z.string().optional(),
      secondBadge: z.string().optional(),
      help: z.string().optional(),
      crisisTitle: z.string().optional(),
      crisisOrder: z.array(z.string()).optional(),
      error: z.string().optional(),
      remaining: z.string().optional(),
      over: z.string().optional(),
      done: z.string().optional(),
      stepSize: z.number().optional(),
      noteLabel: z.string().optional(),
      legendTitle: z.string().optional(),
      legalBadge: z.string().optional(),
      legalFromBadge: z.string().optional(),
      startValue: z.number().optional(),
    }),
  ),
  errorPolicy: z.string(),
  resultPlaceholder: z.object({
    title: z.string(),
    intro: z.string(),
    prioritiesTitle: z.string(),
    temporaryTitle: z.string(),
    signalsTitle: z.string(),
    ethicsTitle: z.string(),
    sourcesTitle: z.string(),
  }),
})

export const rulesFileSchema = z.object({
  version: z.string(),
  maxPriorities: z.number().int().positive(),
  order: z.array(z.string()),
  rules: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kind: z.string(),
      horizon: z.string().optional(),
      sourceIds: z.array(z.string()),
      why: z.string().optional(),
    }),
  ),
  texts: z.object({
    sufficient: z.string(),
    disclaimer: z.string(),
  }),
  signals: z.record(z.string(), z.string()),
})

export type InstrumentsFile = z.infer<typeof instrumentsFileSchema>
export type PhasesFile = z.infer<typeof phasesFileSchema>
export type BaselineFile = z.infer<typeof baselineFileSchema>
export type PairsFile = z.infer<typeof pairsFileSchema>
export type CultureFile = z.infer<typeof cultureFileSchema>
export type ContextFile = z.infer<typeof contextFileSchema>
export type MmvFile = z.infer<typeof mmvFileSchema>
export type StagesFile = z.infer<typeof stagesFileSchema>
export type SourcesFile = z.infer<typeof sourcesFileSchema>
export type RulesFile = z.infer<typeof rulesFileSchema>
export type UiFile = z.infer<typeof uiFileSchema>
export type BundlesFile = z.infer<typeof bundlesFileSchema>

export type ContentBundle = {
  instruments: InstrumentsFile
  phases: PhasesFile
  baseline: BaselineFile
  pairs: PairsFile
  culture: CultureFile
  context: ContextFile
  mmv: MmvFile
  stages: StagesFile
  sources: SourcesFile
  rules: RulesFile
  ui: UiFile
  bundles: BundlesFile
}

export function validateUiReferences(
  ui: UiFile,
  crisisIds: string[],
  testcaseIds: string[],
): void {
  const groeifase = ui.steps.find((s) => s.id === 'groeifase')
  if (!groeifase?.crisisOrder) {
    throw new Error('ui.json: groeifase.crisisOrder ontbreekt')
  }
  const order = groeifase.crisisOrder
  const expected = new Set(crisisIds)
  const got = new Set(order)
  if (expected.size !== got.size || [...expected].some((id) => !got.has(id))) {
    throw new Error('ui.json: crisisOrder bevat niet alle crisis-id\'s uit phases.json')
  }
  if (!testcaseIds.includes(ui.nav.exampleCaseId)) {
    throw new Error(`ui.json: exampleCaseId "${ui.nav.exampleCaseId}" ontbreekt in testcases.json`)
  }
}

export function parseContentFile<T>(
  fileName: string,
  schema: z.ZodType<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const detail = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`${fileName}: ${detail}`)
  }
  return result.data
}

export function validateContentReferences(content: ContentBundle): void {
  const instrumentIds = new Set(content.instruments.instruments.map((i) => i.id))
  const sourceIds = new Set(content.sources.sources.map((s) => s.id))
  const phaseIds = new Set(content.phases.phases.map((p) => p.id))
  const quadrantIds = new Set(content.culture.quadrants.map((q) => q.id))

  const requireInstrument = (id: string, where: string) => {
    if (!instrumentIds.has(id)) throw new Error(`Verwijzing: onbekend instrumentId "${id}" in ${where}`)
  }
  const requireSource = (id: string, where: string) => {
    if (!sourceIds.has(id)) throw new Error(`Verwijzing: onbekend sourceId "${id}" in ${where}`)
  }
  const requirePhase = (id: string, where: string) => {
    if (!phaseIds.has(id as (typeof content.phases.phases)[number]['id'])) {
      throw new Error(`Verwijzing: onbekend phaseId "${id}" in ${where}`)
    }
  }
  const requireQuadrant = (id: string, where: string) => {
    if (!quadrantIds.has(id as (typeof content.culture.quadrants)[number]['id'])) {
      throw new Error(`Verwijzing: onbekend quadrant-id "${id}" in ${where}`)
    }
  }

  for (const inst of content.instruments.instruments) {
    inst.reinforces.forEach((r) => requireInstrument(r, `instruments.json (${inst.id}.reinforces)`))
    inst.sourceIds.forEach((s) => requireSource(s, `instruments.json (${inst.id}.sourceIds)`))
  }

  content.phases.sourceIds.forEach((s) => requireSource(s, 'phases.json'))
  for (const cs of content.phases.crisisSignals) requirePhase(cs.phaseId, 'phases.json (crisisSignals)')

  content.baseline.sourceIds.forEach((s) => requireSource(s, 'baseline.json'))
  for (const [phase, reqs] of Object.entries(content.baseline.requirements)) {
    requirePhase(phase, 'baseline.json')
    for (const instId of Object.keys(reqs)) requireInstrument(instId, `baseline.json (${phase})`)
  }

  content.pairs.sourceIds.forEach((s) => requireSource(s, 'pairs.json'))
  for (const pair of content.pairs.pairs) {
    requireInstrument(pair.a, `pairs.json (${pair.id})`)
    requireInstrument(pair.b, `pairs.json (${pair.id})`)
  }

  content.culture.sourceIds.forEach((s) => requireSource(s, 'culture.json'))
  for (const [phase, expected] of Object.entries(content.culture.expectedByPhase)) {
    requirePhase(phase, 'culture.json (expectedByPhase)')
    expected.forEach((q) => requireQuadrant(q, `culture.json (expectedByPhase.${phase})`))
  }
  for (const q of Object.keys(content.culture.formSentences)) {
    requireQuadrant(q, 'culture.json (formSentences)')
  }

  content.context.future.sourceIds.forEach((s) => requireSource(s, 'context.json (future)'))
  content.context.workforce.sourceIds.forEach((s) => requireSource(s, 'context.json (workforce)'))
  for (const opt of content.context.future.options) {
    opt.temporarySet.forEach((i) => requireInstrument(i, `context.json (future.${opt.id})`))
  }
  for (const opt of content.context.workforce.options) {
    opt.priority.forEach((i) => requireInstrument(i, `context.json (workforce.${opt.id})`))
  }

  content.mmv.sourceIds.forEach((s) => requireSource(s, 'mmv.json'))
  for (const item of content.mmv.items) requireInstrument(item.instrumentId, `mmv.json (${item.id})`)

  for (const rule of content.rules.rules) {
    rule.sourceIds.forEach((s) => requireSource(s, `rules.json (${rule.id})`))
  }

  content.bundles.sourceIds.forEach((s) => requireSource(s, 'bundles.json'))
  const bundleIds = new Set(content.bundles.bundles.map((b) => b.id))
  for (const inst of content.instruments.instruments) {
    if (!bundleIds.has(inst.bundle)) {
      throw new Error(`Verwijzing: bundle "${inst.bundle}" in instruments.json ontbreekt in bundles.json`)
    }
  }
  for (const b of content.bundles.bundles) {
    if (!content.instruments.instruments.some((i) => i.bundle === b.id)) {
      throw new Error(`Verwijzing: bundle "${b.id}" in bundles.json heeft geen instrumenten`)
    }
  }
}
