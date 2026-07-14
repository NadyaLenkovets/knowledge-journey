import { test, expect } from '@playwright/test'
import { articlesIndex } from '../../src/content/articles-index'
import { testsIndex } from '../../src/content/tests-index'

test.describe('P0 — Smoke', () => {
  test('редирект / → /main', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/main$/)
  })

  test('главная: hero и три статьи', async ({ page }) => {
    await page.goto('/main')
    await expect(
      page.getByRole('heading', { name: 'Практика промпт-инжиниринга' }),
    ).toBeVisible()
    await expect(page.getByText(/Короткие статьи с упражнениями/)).toBeVisible()
    for (const article of articlesIndex) {
      await expect(page.getByRole('link', { name: new RegExp(article.title) })).toBeVisible()
    }
  })

  test('хедер: навигация', async ({ page }) => {
    await page.goto('/main')
    await page.getByRole('link', { name: 'Тесты', exact: true }).click()
    await expect(page).toHaveURL(/\/tests$/)

    await page.getByRole('link', { name: 'Prompt Lab' }).click()
    await expect(page).toHaveURL(/\/main$/)
  })

  test('страница тестов: intro и карточки', async ({ page }) => {
    await page.goto('/tests')
    await expect(page.getByRole('heading', { name: 'Тесты по темам' })).toBeVisible()
    await expect(page.getByText(/Здесь можно проверить себя по темам из статей/)).toBeVisible()
    for (const topic of testsIndex) {
      await expect(page.getByRole('heading', { name: topic.title })).toBeVisible()
      await expect(page.getByText(topic.description)).toBeVisible()
    }
  })

  test('несуществующая статья', async ({ page }) => {
    await page.goto('/article/unknown-slug')
    await expect(page.getByText('Статья не найдена')).toBeVisible()
    await page.getByRole('link', { name: 'На главную' }).click()
    await expect(page).toHaveURL(/\/main$/)
  })

  test('несуществующий тест', async ({ page }) => {
    await page.goto('/tests/unknown-slug')
    await expect(page.getByText('Тест не найден')).toBeVisible()
    await page.getByRole('link', { name: 'К списку тестов' }).click()
    await expect(page).toHaveURL(/\/tests$/)
  })
})
