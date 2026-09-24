import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InstrumentTile } from '../src/components/scan/InstrumentTile'
import { togglePhaseChoice } from '../src/scan/phaseToggle'
import { nextStage } from '../src/scan/stageCycle'
import { evaluate } from '../src/engine'
import { createInitialSession } from '../src/scan/initial'
import { fillExampleSession } from '../src/scan/exampleCase'
import { clearSession, loadSession, saveSession } from '../src/scan/storage'
import { sessionToScanInput } from '../src/scan/types'
import { isStepValid } from '../src/scan/validation'
import testcases from './fixtures/testcases.json'

describe('fasekeuze', () => {
  it('twee keuzes en ongedaan maken', () => {
    let first = null as ReturnType<typeof togglePhaseChoice>['phaseFirst']
    let second = null as ReturnType<typeof togglePhaseChoice>['phaseSecond']
    const a = togglePhaseChoice('f1', first, second)
    first = a.phaseFirst
    second = a.phaseSecond
    expect(first).toBe('f1')
    const b = togglePhaseChoice('f2', first, second)
    first = b.phaseFirst
    second = b.phaseSecond
    expect(second).toBe('f2')
    const c = togglePhaseChoice('f1', first, second)
    expect(c.phaseFirst).toBeNull()
    expect(c.phaseSecond).toBe('f2')
  })
})

describe('cultuurstap', () => {
  it('Volgende pas geldig bij 3 × 100 punten', () => {
    const session = createInitialSession()
    expect(isStepValid(2, session)).toBe(true)

    const uneven = {
      ...session,
      culture: {
        ...session.culture,
        d1: { clan: 40, adhocracy: 40, market: 40, hierarchy: 0 },
      },
    }
    expect(isStepValid(2, uneven)).toBe(false)
  })
})

describe('instrumententegel', () => {
  it('vier tikken 0→1→2→3→0', () => {
    expect(nextStage(0)).toBe(1)
    expect(nextStage(1)).toBe(2)
    expect(nextStage(2)).toBe(3)
    expect(nextStage(3)).toBe(0)
  })

  it('klikt van 0 naar 1 in de UI', async () => {
    const user = userEvent.setup()
    const onStage = vi.fn()
    render(
      <InstrumentTile instrumentId="rie" stage={0} onStage={onStage} />,
    )
    const main = screen.getAllByRole('button')[0]
    await user.click(main)
    expect(onStage).toHaveBeenCalledWith(1)
  })
})

describe('opslaan', () => {
  it('herstelt invoer na laden', () => {
    const session = createInitialSession()
    session.orgName = 'Test BV'
    session.size = 42
    saveSession(session)
    const loaded = loadSession()
    expect(loaded?.orgName).toBe('Test BV')
    expect(loaded?.size).toBe(42)
    clearSession()
  })
})

describe('voorbeeldknop', () => {
  it('komt overeen met evaluate(T1)', () => {
    const session = fillExampleSession()
    const result = evaluate(sessionToScanInput(session))
    const expected = testcases.cases.find((c) => c.id === 'T1')!.expected
    expect(result.priorities.map((p) => ({ instrumentId: p.instrumentId, rule: p.rule }))).toEqual(
      expected.priorities,
    )
  })
})
