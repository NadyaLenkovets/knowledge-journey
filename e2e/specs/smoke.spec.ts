import { expect, test } from '@playwright/test'

test.describe('P0 smoke — Knowledge Journey каркас', () => {
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
  })

  test('demo journey стартует и показывает первый шаг', async ({ page }) => {
    await page.goto('/create')
    await page.getByTestId('start-demo').click()
    await expect(page).toHaveURL(/\/journey\/demo$/)
    await expect(page.getByText('Галлюцинации LLM').first()).toBeVisible()
    await expect(page.getByTestId('exercise-check')).toBeVisible()
  })
})
