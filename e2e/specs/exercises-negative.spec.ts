import { test, expect } from '@playwright/test'
import { testsIndex } from '../../src/content/tests-index'
import {
  answerAndNext,
  answerExercise,
  answerPartialMultipleChoice,
  answerWrongSingleChoice,
  exerciseShell,
  getExerciseConfig,
  openTopicTest,
} from '../helpers/exercise-actions'

const LLM_SLUG = 'kak-rabotayut-llm'
const ACCENT_RGB = 'rgb(132, 204, 22)'

test.describe('P3 — Негативные и UX', () => {
  test('P3-01: «Проверить ответ» disabled без выбора', async ({ page }) => {
    await openTopicTest(page, LLM_SLUG)
    const shell = exerciseShell(page)
    const check = shell.getByTestId('exercise-check')

    await expect(check).toBeDisabled()
    await expect(shell.getByText(/Сначала выберите/)).toBeVisible()
  })

  test('P3-02: неверный singleChoice — «Неверно» и разбор', async ({ page }) => {
    await openTopicTest(page, LLM_SLUG)
    const config = getExerciseConfig('llm-test-sc')
    if (config.type !== 'singleChoice') throw new Error('Expected singleChoice')

    const shell = exerciseShell(page)
    await answerWrongSingleChoice(page, config)
    await expect(shell.getByText(config.explanation.incorrect)).toBeVisible()
    await expect(shell.getByTestId('exercise-next')).toBeVisible()
  })

  test('P3-03: частичный multipleChoice — «Частично верно»', async ({ page }) => {
    await openTopicTest(page, LLM_SLUG)
    await answerAndNext(page, getExerciseConfig('llm-test-sc'))
    await answerAndNext(page, getExerciseConfig('llm-test-tf'))

    const config = getExerciseConfig('llm-test-mc')
    if (config.type !== 'multipleChoice') throw new Error('Expected multipleChoice')

    await answerPartialMultipleChoice(page, config)
  })

  test('P3-04: индикатор шага — зелёный после верного ответа', async ({ page }) => {
    await openTopicTest(page, LLM_SLUG)
    await answerExercise(page, getExerciseConfig('llm-test-sc'))
    await expect(page.getByTitle(/^Вопрос 1:/)).toHaveCSS('border-color', ACCENT_RGB)
  })

  test('P3-05: smoke второго теста — 2 шага (галлюцинации)', async ({ page }) => {
    const topic = testsIndex.find((t) => t.slug === 'galjucinacii')
    if (!topic) throw new Error('galjucinacii test missing')

    await openTopicTest(page, topic.slug)
    await answerAndNext(page, getExerciseConfig(topic.exerciseIds[0]))
    await answerAndNext(page, getExerciseConfig(topic.exerciseIds[1]))
    await expect(page.getByText('Вопрос 3 из 10')).toBeVisible()
  })
})
