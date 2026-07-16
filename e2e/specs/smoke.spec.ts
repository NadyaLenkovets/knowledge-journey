import { expect, test } from '@playwright/test'
import { completeDemoJourney } from '../helpers/journey-actions'

const healthyApi = {
  ok: true,
  modelConfigured: true,
  model: 'openrouter/free',
}

test.describe('P0 smoke — Knowledge Journey', () => {
  test.beforeEach(async ({ page }) => {
    // preview без Hono: глушим proxy noise на /api/health
    await page.route('**/api/health', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(healthyApi),
      })
    })
  })

  test('главная показывает бренд и CTA', async ({ page }) => {
    await page.goto('/home')
    await expect(page.getByText('Knowledge Journey').first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Путешествие по знаниям' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Начать путешествие' }),
    ).toBeVisible()
  })

  test('корневой URL редиректит на /home', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/home$/)
  })

  test('маршрут /create открывается из шапки', async ({ page }) => {
    await page.goto('/home')
    await page.getByRole('link', { name: 'Создать' }).click()
    await expect(page).toHaveURL(/\/create$/)
    await expect(
      page.getByRole('heading', { name: 'Новое путешествие' }),
    ).toBeVisible()
    await expect(page.getByTestId('start-demo')).toBeVisible()
  })

  test('без API на /create показывается предупреждение, demo доступен', async ({
    page,
  }) => {
    await page.unroute('**/api/health')
    await page.route('**/api/health', (route) => route.abort())
    await page.goto('/create')
    await expect(
      page.getByText(/API недоступен|Demo работает без сервера/i).first(),
    ).toBeVisible()
    await expect(page.getByTestId('start-demo')).toBeEnabled()
  })

  test('мок health: API готов', async ({ page }) => {
    await page.goto('/create')
    await expect(page.getByText(/API готов/)).toBeVisible()
  })

  test('demo journey стартует и показывает первый шаг', async ({ page }) => {
    await page.goto('/create')
    await page.getByTestId('start-demo').click()
    await expect(page).toHaveURL(/\/journey\/demo$/)
    await expect(page.getByText('Галлюцинации LLM').first()).toBeVisible()
    await expect(page.getByTestId('exercise-check')).toBeVisible()
  })

  test('полный demo → отчёт с разбором и кнопкой печати', async ({ page }) => {
    test.setTimeout(240_000)
    await completeDemoJourney(page)

    await page.getByTestId('go-to-report').click()
    await expect(page).toHaveURL(/\/journey\/demo\/report$/)
    await expect(page.getByTestId('report-page')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Отчёт о путешествии' }),
    ).toBeVisible()
    await expect(page.getByText('Разбор ответов')).toBeVisible()
    await expect(page.getByText('Блок 1.').first()).toBeVisible()
    await expect(page.getByTestId('print-report')).toBeVisible()
  })

  test('generating без API предлагает fallback demo', async ({ page }) => {
    await page.route('**/api/generate-journey', (route) => route.abort())
    await page.goto('/create')
    await page
      .getByPlaceholder('Например: галлюцинации больших языковых моделей')
      .fill('тест галлюцинаций')
    await page.getByTestId('start-generate').click()
    await expect(page).toHaveURL(/\/generating/)
    await expect(page.getByTestId('fallback-demo')).toBeVisible({
      timeout: 30_000,
    })
    await page.getByTestId('fallback-demo').click()
    await expect(page).toHaveURL(/\/journey\/demo$/)
  })
})
