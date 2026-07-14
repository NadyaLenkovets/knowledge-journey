import { expect, type Locator, type Page } from '@playwright/test'
import { exercisesById } from '../../src/content/exercises/index'
import type { ExerciseConfig } from '../../src/types/exercise'

export function getExerciseConfig(id: string): ExerciseConfig {
  const config = exercisesById[id]
  if (!config) throw new Error(`Unknown exercise: ${id}`)
  return config
}

function optionLabel(config: ExerciseConfig, optionId: string): string {
  if (
    config.type !== 'singleChoice' &&
    config.type !== 'multipleChoice' &&
    config.type !== 'failureModePicker'
  ) {
    throw new Error(`Not a choice exercise: ${config.id}`)
  }
  const option = config.options.find((o) => o.id === optionId)
  if (!option) throw new Error(`Option ${optionId} in ${config.id}`)
  return option.label
}

export function exerciseShell(page: Page, shellIndex?: number): Locator {
  const shells = page.getByRole('group', { name: 'Интерактивное упражнение' })
  return shellIndex === undefined ? shells.last() : shells.nth(shellIndex)
}

function wrongOptionId(
  config: Extract<ExerciseConfig, { type: 'singleChoice' }>,
): string {
  const correct = new Set(
    Array.isArray(config.correctOptionIds)
      ? config.correctOptionIds
      : [config.correctOptionIds],
  )
  const wrong = config.options.find((o) => !correct.has(o.id))
  if (!wrong) throw new Error(`No wrong option for ${config.id}`)
  return wrong.id
}

export async function clickCheck(shell: Locator) {
  const check = shell.getByTestId('exercise-check')
  await expect(check).toBeEnabled({ timeout: 15_000 })
  await check.click()
}

async function expectAnswered(shell: Locator) {
  await expect(
    shell.getByText('Верно!').or(shell.getByText('Частично верно')).first(),
  ).toBeVisible()
}

async function readOrderStepIds(page: Page): Promise<string[]> {
  return page.locator('[data-testid^="order-step-row-"]').evaluateAll((nodes) =>
    nodes.map((node) =>
      node.getAttribute('data-testid')!.replace('order-step-row-', ''),
    ),
  )
}

async function sortOrderSteps(page: Page, correctOrderIds: string[]) {
  const targetKey = correctOrderIds.join(',')
  const maxAttempts = correctOrderIds.length * 6

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const ids = await readOrderStepIds(page)
    if (ids.join(',') === targetKey) return

    const mismatchIndex = ids.findIndex((id, i) => id !== correctOrderIds[i])
    if (mismatchIndex < 0) return

    const wantId = correctOrderIds[mismatchIndex]
    const currentIdx = ids.indexOf(wantId)
    if (currentIdx > mismatchIndex) {
      await page.getByTestId(`order-step-up-${wantId}`).click()
    } else if (currentIdx < mismatchIndex) {
      await page.getByTestId(`order-step-down-${wantId}`).click()
    }
  }

  const final = await readOrderStepIds(page)
  if (final.join(',') !== targetKey) {
    throw new Error(`Order steps mismatch: expected ${targetKey}, got ${final.join(',')}`)
  }
}

export async function answerExercise(
  page: Page,
  config: ExerciseConfig,
  shellIndex?: number,
) {
  const shell = exerciseShell(page, shellIndex)
  await shell.scrollIntoViewIfNeeded()

  switch (config.type) {
    case 'singleChoice': {
      const correctId = config.correctOptionIds[0]
      const label = optionLabel(config, correctId)
      await page
        .getByRole('radiogroup', { name: config.prompt })
        .getByRole('radio', { name: label })
        .click()
      break
    }
    case 'multipleChoice':
    case 'failureModePicker': {
      const group = page.getByRole('group', { name: config.prompt })
      for (const id of config.correctOptionIds) {
        await group.getByRole('checkbox', { name: optionLabel(config, id) }).click()
      }
      break
    }
    case 'trueFalse': {
      const label = config.correctAnswer ? 'Верно' : 'Неверно'
      await shell.getByRole('radio', { name: label, exact: true }).click()
      break
    }
    case 'fillTheBlank': {
      for (const blank of config.blanks) {
        await shell
          .getByTestId(`fill-blank-${blank.id}`)
          .fill(blank.correctAnswers[0])
      }
      break
    }
    case 'matchPairs': {
      for (const pair of config.pairs) {
        const drop = page.getByTestId(`match-pair-drop-${pair.leftId}`)
        await page.getByTestId(`match-pair-drag-${pair.rightId}`).click()
        await drop.click()
        await expect(drop).toContainText(pair.rightLabel)
      }
      break
    }
    case 'orderSteps': {
      await sortOrderSteps(page, config.correctOrderIds)
      break
    }
    case 'promptBuilder': {
      for (const slot of config.slots) {
        const block = config.blocks.find((b) => b.id === slot.correctBlockId)
        const drop = page.getByTestId(`prompt-slot-${slot.slotId}`)
        await page.getByTestId(`prompt-block-${slot.correctBlockId}`).click()
        await drop.click()
        if (block) {
          await expect(drop).toContainText(block.preview.slice(0, 20))
        }
      }
      break
    }
    case 'spotTheHallucination': {
      for (const spanId of config.correctSpanIds) {
        await shell.getByTestId(`spot-span-${spanId}`).click()
      }
      break
    }
    default: {
      const _exhaustive: never = config
      throw new Error(`Unsupported type: ${(_exhaustive as ExerciseConfig).type}`)
    }
  }

  await clickCheck(shell)
  await expectAnswered(shell)
}

export async function answerAndNext(page: Page, config: ExerciseConfig) {
  await answerExercise(page, config)
  const next = page.getByTestId('exercise-next')
  await expect(next).toBeVisible()
  await next.click()
}

export async function completeTopicTest(page: Page, exerciseIds: string[]) {
  for (const id of exerciseIds) {
    await answerAndNext(page, getExerciseConfig(id))
  }
  await expect(page.getByRole('heading', { name: 'Тест завершён' })).toBeVisible()
}

export async function answerWrongSingleChoice(
  page: Page,
  config: Extract<ExerciseConfig, { type: 'singleChoice' }>,
) {
  const shell = exerciseShell(page)
  const wrongId = wrongOptionId(config)
  const label = optionLabel(config, wrongId)
  await page
    .getByRole('radiogroup', { name: config.prompt })
    .getByRole('radio', { name: label })
    .click()
  await clickCheck(shell)
  await expect(shell.getByText('Неверно')).toBeVisible()
}

export async function answerPartialMultipleChoice(
  page: Page,
  config: Extract<ExerciseConfig, { type: 'multipleChoice' }>,
) {
  const shell = exerciseShell(page)
  const group = page.getByRole('group', { name: config.prompt })
  const partialId = config.correctOptionIds[0]
  await group.getByRole('checkbox', { name: optionLabel(config, partialId) }).click()
  await clickCheck(shell)
  await expect(shell.getByText('Частично верно')).toBeVisible()
}

export async function openTopicTest(page: Page, slug: string) {
  await page.goto(`/tests/${slug}`)
  await expect(page.getByText('Вопрос 1 из 10')).toBeVisible()
}
