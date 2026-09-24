import AxeBuilder from '@axe-core/playwright'
import { PDFDocument } from 'pdf-lib'
import { expect, test } from '@playwright/test'
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] as const

async function expectNoViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .withTags([...axeTags])
    .analyze()
  expect(results.violations).toEqual([])
}

async function openT1Report(page: import('@playwright/test').Page) {
  await page.goto('/scan')
  await page.getByRole('button', { name: /voorbeeld/i }).click()
  await page.locator('#rapport').waitFor({ state: 'visible', timeout: 15_000 })
}

test('landingspagina heeft geen axe-overtredingen', async ({ page }) => {
  await page.goto('/')
  await expectNoViolations(page)
})

test('eerste scanstap heeft geen axe-overtredingen', async ({ page }) => {
  await page.goto('/scan')
  await expectNoViolations(page)
})

test('rapport na voorbeeldknop heeft geen axe-overtredingen', async ({ page }) => {
  await openT1Report(page)
  await expectNoViolations(page)
})

test('rapport in printmedia heeft geen axe-overtredingen', async ({ page }) => {
  await openT1Report(page)
  await page.emulateMedia({ media: 'print' })
  await expectNoViolations(page)
})

test('lettertypelicenties niet zichtbaar in printmedia', async ({ page }) => {
  await openT1Report(page)
  await page.emulateMedia({ media: 'print' })
  await expect(
    page.getByRole('link', { name: 'Lettertypelicenties' }),
  ).toBeHidden()
})

test('T1 rapport-pdf heeft maximaal 4 paginas', async ({ page }) => {
  await openT1Report(page)
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  const doc = await PDFDocument.load(pdf)
  expect(doc.getPageCount()).toBeLessThanOrEqual(4)
})
