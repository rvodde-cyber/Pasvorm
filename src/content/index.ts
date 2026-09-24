import baselineData from './baseline.json'
import contextData from './context.json'
import cultureData from './culture.json'
import instrumentsData from './instruments.json'
import mmvData from './mmv.json'
import pairsData from './pairs.json'
import phasesData from './phases.json'
import rulesData from './rules.json'
import {
  baselineFileSchema,
  contextFileSchema,
  cultureFileSchema,
  type ContentBundle,
  instrumentsFileSchema,
  mmvFileSchema,
  pairsFileSchema,
  parseContentFile,
  phasesFileSchema,
  rulesFileSchema,
  sourcesFileSchema,
  stagesFileSchema,
  validateContentReferences,
} from './schema'
import sourcesData from './sources.json'
import stagesData from './stages.json'

function loadContent(): ContentBundle {
  const content: ContentBundle = {
    instruments: parseContentFile('instruments.json', instrumentsFileSchema, instrumentsData),
    phases: parseContentFile('phases.json', phasesFileSchema, phasesData),
    baseline: parseContentFile('baseline.json', baselineFileSchema, baselineData),
    pairs: parseContentFile('pairs.json', pairsFileSchema, pairsData),
    culture: parseContentFile('culture.json', cultureFileSchema, cultureData),
    context: parseContentFile('context.json', contextFileSchema, contextData),
    mmv: parseContentFile('mmv.json', mmvFileSchema, mmvData),
    stages: parseContentFile('stages.json', stagesFileSchema, stagesData),
    sources: parseContentFile('sources.json', sourcesFileSchema, sourcesData),
    rules: parseContentFile('rules.json', rulesFileSchema, rulesData),
  }
  validateContentReferences(content)
  return content
}

export const content = loadContent()

export {
  parseContentFile,
  validateContentReferences,
  type ContentBundle,
} from './schema'

export type { InstrumentsFile, PhasesFile, CultureFile, ContextFile, RulesFile } from './schema'
