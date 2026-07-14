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

  test('цепочка заглушек create → generating → journey → report', async ({
    page,
  }) => {
    await page.goto('/create')
    await page.getByRole('link', { name: 'Далее (заглушка)' }).click()
    await expect(page).toHaveURL(/\/generating$/)
    await page.getByRole('link', { name: 'Открыть заглушку прохождения' }).click()
    await expect(page).toHaveURL(/\/journey\/demo$/)
    await page.getByRole('link', { name: 'К отчёту (заглушка)' }).click()
    await expect(page).toHaveURL(/\/journey\/demo\/report$/)
    await expect(
      page.getByRole('heading', { name: 'Отчёт о путешествии' }),
    ).toBeVisible()
  })
})
