import testcases from '../../tests/fixtures/testcases.json'
import { content } from '../content'
import type { QuadrantId } from '../engine/types'
import { initialCulture } from './initial'
import type { ScanSession } from './types'

function profileToCulture(profile: Record<QuadrantId, number>): ScanSession['culture'] {
  const culture = initialCulture()
  for (const dim of content.culture.dimensions) {
    culture[dim.id as keyof ScanSession['culture']] = { ...profile }
  }
  return culture
}

export function sessionFromExampleCaseId(caseId: string): ScanSession | null {
  const tc = testcases.cases.find((c) => c.id === caseId)
  if (!tc) return null
  const raw = tc.input
  const crisis = raw.crisis ?? {}
  const [phaseFirst, phaseSecond] = raw.phaseChoices as [ScanSession['phaseFirst'], ScanSession['phaseSecond']]
  return {
    step: 7,
    orgName: '',
    size: raw.size,
    phaseFirst,
    phaseSecond,
    crisis: crisis as ScanSession['crisis'],
    culture: profileToCulture(raw.culture as Record<QuadrantId, number>),
    future: raw.future as ScanSession['future'],
    futureNote: '',
    workforce: raw.workforce as ScanSession['workforce'],
    stages: (raw.stages ?? {}) as ScanSession['stages'],
    mmv: (raw.mmv ?? {}) as ScanSession['mmv'],
  }
}

export function fillExampleSession(): ScanSession {
  const id = content.ui.nav.exampleCaseId
  const session = sessionFromExampleCaseId(id)
  if (!session) throw new Error(`Voorbeeldcasus ${id} niet gevonden`)
  return session
}
