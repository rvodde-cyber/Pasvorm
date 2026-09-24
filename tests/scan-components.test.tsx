import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Scan } from '../src/components/Scan'
import { InstrumentStageRow } from '../src/components/scan/InstrumentStageRow'
import { StepCultuur } from '../src/components/scan/steps/StepCultuur'
import { content } from '../src/content'
import { evaluate } from '../src/engine'
import { fillExampleSession } from '../src/scan/exampleCase'
import { createInitialSession } from '../src/scan/initial'
import { togglePhaseChoice } from '../src/scan/phaseToggle'
import { clearSession, loadSession, saveSession } from '../src/scan/storage'
import { sessionToScanInput } from '../src/scan/types'
import { isStepValid } from '../src/scan/validation'
import testcases from './fixtures/testcases.json'
import { mockScan } from './mockScan'

afterEach(() => cleanup())

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
  it('begint op 0 en is ongeldig tot 3 × 100 punten', () => {
    const session = createInitialSession()
    expect(session.culture.d1.clan).toBe(0)
    expect(isStepValid(2, session)).toBe(false)

    const even = { ...session }
    for (const dim of content.culture.dimensions) {
      even.culture = {
        ...even.culture,
        [dim.id]: { clan: 25, adhocracy: 25, market: 25, hierarchy: 25 },
      }
    }
    expect(isStepValid(2, even)).toBe(true)
  })

  it('toont nog te verdelen bij start en fout na Volgende-klik', async () => {
    const user = userEvent.setup()
    clearSession()
    const session = createInitialSession()
    session.step = 2
    saveSession(session)

    render(
      <MemoryRouter initialEntries={['/scan']}>
        <Scan />
      </MemoryRouter>,
    )

    expect(screen.getAllByText(/Nog te verdelen: 100 punten/)[0]).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: content.ui.nav.next }))
    expect(screen.getByRole('alert')).toHaveTextContent(content.ui.steps[2].error!)
  })
})

describe('instrumentenstap', () => {
  it('heeft per instrument een radiogroep, pijltjestoetsen wisselen stadium', async () => {
    const user = userEvent.setup()
    const onStage = vi.fn()
    render(<InstrumentStageRow instrumentId="rie" stage={0} onStage={onStage} />)

    const group = screen.getByRole('radiogroup', { name: /RI&E/i })
    const radios = within(group).getAllByRole('radio')
    expect(radios).toHaveLength(4)
    expect(radios[0]).toBeChecked()

    radios[0].focus()
    await user.keyboard('{ArrowRight}')
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

describe('StepCultuur aria-labels', () => {
  it('labelt invoer met beschrijving, niet kwadrantnaam', () => {
    const session = createInitialSession()
    render(<StepCultuur scan={mockScan(session)} />)
    const dim = content.culture.dimensions[0]
    const firstDesc = dim.items.clan
    expect(screen.getAllByLabelText(firstDesc).length).toBeGreaterThan(0)
    expect(screen.queryByLabelText(/clan/i)).not.toBeInTheDocument()
  })
})
