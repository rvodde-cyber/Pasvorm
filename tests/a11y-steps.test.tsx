import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Scan } from '../src/components/Scan'
import { StepCultuur } from '../src/components/scan/steps/StepCultuur'
import { StepGroeifase } from '../src/components/scan/steps/StepGroeifase'
import { StepInstrumenten } from '../src/components/scan/steps/StepInstrumenten'
import { StepMoreel } from '../src/components/scan/steps/StepMoreel'
import { StepOrganisatie } from '../src/components/scan/steps/StepOrganisatie'
import { StepPersoneel } from '../src/components/scan/steps/StepPersoneel'
import { Report } from '../src/components/report/Report'
import { StepToekomst } from '../src/components/scan/steps/StepToekomst'
import { evaluate } from '../src/engine'
import { fillExampleSession } from '../src/scan/exampleCase'
import { createInitialSession } from '../src/scan/initial'
import { clearSession, saveSession } from '../src/scan/storage'
import { sessionToScanInput } from '../src/scan/types'
import { mockScan } from './mockScan'

const axeOptions = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
}

describe('axe WCAG 2.2 AA per stap', () => {
  it('stap 0 organisatie', async () => {
    const { container } = render(<StepOrganisatie scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('stap 1 groeifase', async () => {
    const { container } = render(<StepGroeifase scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('stap 2 cultuur', async () => {
    const { container } = render(<StepCultuur scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('stap 3 toekomst', async () => {
    const { container } = render(<StepToekomst scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('stap 4 personeel', async () => {
    const { container } = render(<StepPersoneel scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('stap 5 instrumenten', async () => {
    const { container } = render(<StepInstrumenten scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('stap 6 moreel', async () => {
    const { container } = render(<StepMoreel scan={mockScan(createInitialSession())} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('resultaat na voorbeeldcasus', async () => {
    const session = fillExampleSession()
    const result = evaluate(sessionToScanInput(session))
    const { container } = render(<Report result={result} session={session} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })
})

describe('axe WCAG 2.2 AA scan-shell', () => {
  it.each([0, 1, 2, 3, 4, 5, 6] as const)('stap %i met navigatie', async (step) => {
    clearSession()
    const session = createInitialSession()
    session.step = step
    saveSession(session)
    const { container } = render(
      <MemoryRouter initialEntries={['/scan']}>
        <Scan />
      </MemoryRouter>,
    )
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  }, 15_000)

  it('resultaat met navigatie', async () => {
    clearSession()
    const filled = fillExampleSession()
    filled.step = 7
    saveSession(filled)
    const { container } = render(
      <MemoryRouter initialEntries={['/scan']}>
        <Scan />
      </MemoryRouter>,
    )
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  }, 15_000)
})
