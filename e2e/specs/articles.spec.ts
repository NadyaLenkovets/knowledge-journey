import { test, expect } from '@playwright/test'
import { kakRabotayutLlmArticle } from '../../src/content/articles/kak-rabotayut-llm'
import { galjucinaciiArticle } from '../../src/content/articles/galjucinacii'
import { strukturaPromptaArticle } from '../../src/content/articles/struktura-prompta'
import { answerExercise, getExerciseConfig } from '../helpers/exercise-actions'

test.describe('P1 — Статьи и inline-упражнения', () => {
  test('статья LLM: обложка, singleChoice и orderSteps', async ({ page }) => {
    await page.goto(`/article/${kakRabotayutLlmArticle.slug}`)
    await expect(page.getByRole('heading', { name: kakRabotayutLlmArticle.title })).toBeVisible()
    await expect(page.getByText(kakRabotayutLlmArticle.description)).toBeVisible()

    await answerExercise(page, getExerciseConfig('llm-1-sc'), 0)
    await answerExercise(page, getExerciseConfig('llm-inline-order'), 1)

    await page.getByRole('link', { name: /Все статьи/ }).click()
    await expect(page).toHaveURL(/\/main$/)
  })

  test('статья «Галлюцинации»: multipleChoice и spot', async ({ page }) => {
    await page.goto(`/article/${galjucinaciiArticle.slug}`)
    await expect(page.getByRole('heading', { name: galjucinaciiArticle.title })).toBeVisible()

    await answerExercise(page, getExerciseConfig('hall-inline-mc'), 0)
    await answerExercise(page, getExerciseConfig('hall-inline-spot'), 1)
  })

  test('статья «Структура промпта»: matchPairs и failureModePicker', async ({ page }) => {
    await page.goto(`/article/${strukturaPromptaArticle.slug}`)
    await expect(page.getByRole('heading', { name: strukturaPromptaArticle.title })).toBeVisible()

    await answerExercise(page, getExerciseConfig('prompt-inline-match'), 0)
    await answerExercise(page, getExerciseConfig('prompt-inline-failure'), 1)
  })
})
