import { test, expect } from '@playwright/test'
import { testsIndex } from '../../src/content/tests-index'
import { completeTopicTest } from '../helpers/exercise-actions'

for (const topic of testsIndex) {
  test.describe(`P2 — Тест «${topic.title}»`, () => {
    test(`полный прогон 10 шагов (${topic.slug})`, async ({ page }) => {
      await page.goto('/tests')
      await page.getByRole('link', { name: new RegExp(topic.title) }).click()
      await expect(page).toHaveURL(new RegExp(`/tests/${topic.slug}$`))
      await expect(page.getByText('Вопрос 1 из 10')).toBeVisible()

      await completeTopicTest(page, topic.exerciseIds)

      await expect(page.getByText(/Баллы:/)).toBeVisible()
      await page.getByRole('link', { name: 'Перечитать статью →' }).click()
      await expect(page).toHaveURL(new RegExp(`/article/${topic.slug}$`))

      await page.goto('/tests')
      await expect(page).toHaveURL(/\/tests$/)
    })
  })
}
