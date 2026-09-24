import type { CoreId } from './core'
import type { FutureId } from './future'
import type { CvfScores } from '../utils/culture'

export interface ScanExample {
  org: string
  size: string
  phaseId: number
  cvfScores: CvfScores
  futureId: FutureId
  futureNote: string
  coreId: CoreId
  present: Record<string, boolean>
}

export const scanExample: ScanExample = {
  org: 'Schoonmaakbedrijf (voorbeeld)',
  size: '200',
  phaseId: 2,
  cvfScores: { clan: 2, adhocracy: 1, market: 3, hierarchy: 5 },
  futureId: 'gelijk',
  futureNote: '',
  coreId: 'uitvoerend',
  present: {
    personeelsdossier: true,
    arbeidsovereenkomsten: true,
    verzuimbeleid: true,
    avg_privacy: true,
    rie: true,
    medezeggenschap: true,
  },
}
