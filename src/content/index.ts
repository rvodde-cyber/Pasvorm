import baselineData from './baseline.json'
import bundlesData from './bundles.json'
import contextData from './context.json'
import cultureData from './culture.json'
import instrumentsData from './instruments.json'
import mmvData from './mmv.json'
import pairsData from './pairs.json'
import phasesData from './phases.json'
import rulesData from './rules.json'
import {
  baselineFileSchema,
  bundlesFileSchema,
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
  uiFileSchema,
  validateContentReferences,
  validateUiReferences,
} from './schema'
import sourcesData from './sources.json'
import stagesData from './stages.json'
import uiData from './ui.json'
import testcasesData from '../../tests/fixtures/testcases.json'

function loadContent(): ContentBundle {
  const instruments = parseContentFile('instruments.json', instrumentsFileSchema, instrumentsData)
  const phases = parseContentFile('phases.json', phasesFileSchema, phasesData)
  const content: ContentBundle = {
    instruments,
    phases,
    baseline: parseContentFile('baseline.json', baselineFileSchema, baselineData),
    bundles: parseContentFile('bundles.json', bundlesFileSchema, bundlesData),
    pairs: parseContentFile('pairs.json', pairsFileSchema, pairsData),
    culture: parseContentFile('culture.json', cultureFileSchema, cultureData),
    context: parseContentFile('context.json', contextFileSchema, contextData),
    mmv: parseContentFile('mmv.json', mmvFileSchema, mmvData),
    stages: parseContentFile('stages.json', stagesFileSchema, stagesData),
    sources: parseContentFile('sources.json', sourcesFileSchema, sourcesData),
    rules: parseContentFile('rules.json', rulesFileSchema, rulesData),
    ui: parseContentFile('ui.json', uiFileSchema, uiData),
  }
  validateContentReferences(content)
  const crisisIds = content.phases.crisisSignals.map((c) => c.id)
  const testcaseIds = testcasesData.cases.map((c) => c.id)
  validateUiReferences(content.ui, crisisIds, testcaseIds)
  return content
}

export const content = loadContent()

export {
  parseContentFile,
  validateContentReferences,
  validateUiReferences,
  type ContentBundle,
} from './schema'
