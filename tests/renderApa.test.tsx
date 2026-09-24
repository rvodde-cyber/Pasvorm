import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApa } from '../src/utils/renderApa'

describe('renderApa', () => {
  it('zet *cursief* om naar em', () => {
    render(<p>{renderApa('Titel van *een tijdschrift* uit 2020.')}</p>)
    const em = screen.getByText('een tijdschrift')
    expect(em.tagName).toBe('EM')
  })
})
