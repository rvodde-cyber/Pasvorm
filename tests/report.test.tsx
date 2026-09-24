import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Report } from '../src/components/report/Report'
import { Scan } from '../src/components/Scan'
import { content } from '../src/content'
import { evaluate } from '../src/engine'
import { sessionFromExampleCaseId } from '../src/scan/exampleCase'
import { sessionToScanInput } from '../src/scan/types'
import testcases from './fixtures/testcases.json'
import { MemoryRouter } from 'react-router-dom'

const axeOptions = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
}

const MODEL_NAME = 'Model Moreel Vakmanschap'

afterEach(() => cleanup())

function renderCase(caseId: string) {
  const session = sessionFromExampleCaseId(caseId)
  if (!session) throw new Error(caseId)
  const result = evaluate(sessionToScanInput(session))
  return render(<Report result={result} session={session} />)
}

describe('Report', () => {
  for (const tc of testcases.cases) {
    it(`${tc.id} rendert zonder fout`, () => {
      renderCase(tc.id)
      expect(screen.getByRole('article')).toHaveAttribute('id', 'rapport')
    })
  }

  it('T1: eerstvolgende stap toont meldregeling', () => {
    renderCase('T1')
    const step = screen.getByText(content.ui.report.summary.nextStep).closest('div')!
    expect(within(step).getByText(/Meldregeling en meldcultuur/)).toBeInTheDocument()
  })

  it('T4: sufficientStep en sufficient-tekst', () => {
    renderCase('T4')
    expect(screen.getByText(content.ui.report.summary.sufficientStep)).toBeInTheDocument()
    expect(screen.getByText(content.rules.texts.sufficient)).toBeInTheDocument()
  })

  it('T3: basis met reden legal', () => {
    renderCase('T3')
    const basis = content.bundles.bundles.find((b) => b.id === 'basis')!
    const row = screen.getByText(basis.label, { exact: false }).closest('li')!
    expect(row.textContent).toContain(content.ui.report.fit.reasons.legal)
  })

  it('T6: opportunity Ruim met ruim-reden', () => {
    renderCase('T6')
    const opp = content.bundles.bundles.find((b) => b.id === 'opportunity')!
    const row = screen.getByText(opp.label, { exact: false }).closest('li')!
    expect(row.textContent).toContain(content.ui.report.fit.status.ruim)
    expect(row.textContent).toContain(content.ui.report.fit.reasons.ruim)
  })

  it('bevat privacy en alle method-bronnen', () => {
    const { container } = renderCase('T1')
    expect(screen.getByText(content.ui.report.privacy)).toBeInTheDocument()
    const text = container.textContent ?? ''
    for (const id of content.ui.report.method.sourceIds) {
      const src = content.sources.sources.find((s) => s.id === id)
      expect(src).toBeDefined()
      expect(text).toContain(src!.id === 'MMV' ? 'moreelvakmanschap.nl/model' : src!.apa.slice(0, 12))
    }
  })

  it('MMV-bron bevat model-URL', () => {
    renderCase('T1')
    expect(screen.getByText(/https:\/\/moreelvakmanschap\.nl\/model/)).toBeInTheDocument()
  })

  it('Modelnaam alleen in method en bronnen', () => {
    renderCase('T1')
    const article = screen.getByRole('article')
    const method = screen.getByRole('heading', { name: content.ui.report.method.title }).parentElement!
    expect(method.textContent).toContain(MODEL_NAME)
    expect(article.textContent!.match(new RegExp(MODEL_NAME, 'g'))!.length).toBeGreaterThanOrEqual(1)
  })

  it('scanstappen en MMV-sectie zonder modelnaam', () => {
    renderCase('T1')
    const mmvSection = screen.getByRole('heading', { name: content.ui.report.mmv.title }).parentElement!
    expect(mmvSection.textContent).not.toContain(MODEL_NAME)
  })

  it('printknop zet titel en herstelt na afterprint', async () => {
    const user = userEvent.setup()
    const session = sessionFromExampleCaseId('T1')!
    const result = evaluate(sessionToScanInput(session))
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    const previous = document.title

    render(<Report result={result} session={session} />)
    await user.click(screen.getByRole('button', { name: content.ui.report.actions.print }))
    expect(document.title).toContain('Pasvorm-rapport')
    window.dispatchEvent(new Event('afterprint'))
    expect(document.title).toBe(previous)
    printSpy.mockRestore()
  })

  it.each(['T1', 'T8'] as const)('axe WCAG 2.2 AA voor %s', async (caseId) => {
    const session = sessionFromExampleCaseId(caseId)!
    const result = evaluate(sessionToScanInput(session))
    const { container } = render(<Report result={result} session={session} />)
    expect((await axe(container, axeOptions)).violations).toHaveLength(0)
  })

  it('Scan-stappen bevatten modelnaam niet', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/scan']}>
        <Scan />
      </MemoryRouter>,
    )
    expect(container.textContent).not.toContain(MODEL_NAME)
  })
})
