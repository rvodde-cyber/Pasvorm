import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const axeTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] as const

async function expectNoViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .withTags([...axeTags])
    .analyze()
  expect(results.violations).toEqual([])
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
  await page.goto('/scan')
  await page.getByRole('button', { name: /voorbeeld/i }).click()
  await page.locator('#rapport').waitFor({ state: 'visible', timeout: 15_000 })
  await expectNoViolations(page)
})

test('rapport in printmedia heeft geen axe-overtredingen', async ({ page }) => {
  await page.goto('/scan')
  await page.getByRole('button', { name: /voorbeeld/i }).click()
  await page.locator('#rapport').waitFor({ state: 'visible', timeout: 15_000 })
  await page.emulateMedia({ media: 'print' })
  await expectNoViolations(page)
})
