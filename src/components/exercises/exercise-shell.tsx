import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ExerciseExplanation, ExerciseMode } from '@/types/exercise'
import { answerStatusStyles, palette, type AnswerStatus } from '@/theme/palette'

type ExerciseShellProps = {
  title?: string
  mode?: ExerciseMode
  children: ReactNode
  uiState: 'idle' | 'answered'
  isCorrect: boolean | null
  score?: number
  maxScore?: number
  explanation: ExerciseExplanation | null
  onCheck?: () => void
  onNext?: () => void
  canCheck?: boolean
  checkHint?: string
  accentBorder?: string
}

function resolveFeedback(
  isCorrect: boolean | null,
  score?: number,
  maxScore?: number,
): AnswerStatus | null {
  if (isCorrect === null) return null
  if (score !== undefined && maxScore !== undefined && maxScore > 0) {
    const ratio = score / maxScore
    if (ratio >= 1) return 'correct'
    if (ratio > 0) return 'partial'
    return 'incorrect'
  }
  return isCorrect ? 'correct' : 'incorrect'
}

export function ExerciseShell({
  title,
  mode = 'inline',
  children,
  uiState,
  isCorrect,
  score,
  maxScore,
  explanation,
  onCheck,
  onNext,
  canCheck = true,
  checkHint,
  accentBorder = 'accent',
}: ExerciseShellProps) {
  const isAnswered = uiState === 'answered'
  const feedback = resolveFeedback(isCorrect, score, maxScore)
  const showFeedback = isAnswered && explanation !== null && feedback !== null
  const isTestMode = mode === 'test'
  const shellTitle = title ?? (isTestMode ? 'Вопрос' : 'Проверь себя')
  const styles = feedback ? answerStatusStyles[feedback] : null

  const cardBorderColor = styles?.border ?? palette.border
  const cardBg = isAnswered ? (styles?.cardBg ?? palette.surfaceCard) : palette.surfaceCard

  const scorePercent =
    score !== undefined && maxScore !== undefined && maxScore > 0
      ? Math.round((score / maxScore) * 100)
      : null

  return (
    <Box
      my={isTestMode ? 0 : 8}
      p={6}
      bg={cardBg}
      borderRadius="1rem"
      borderWidth="2px"
      borderColor={cardBorderColor}
      borderLeftWidth="4px"
      borderLeftColor={isAnswered ? cardBorderColor : accentBorder}
      role="group"
      aria-label="Интерактивное упражнение"
      transition="background 0.2s, border-color 0.2s"
    >
      <Text
        fontSize="sm"
        fontWeight="600"
        color={palette.accent}
        textTransform="uppercase"
        letterSpacing="wider"
        mb={4}
      >
        {shellTitle}
      </Text>

      <VStack align="stretch" gap={5}>
        {children}

        {showFeedback && styles && (
          <Box
            aria-live="polite"
            p={4}
            borderRadius="md"
            borderWidth="2px"
            borderColor={styles.border}
            bg={styles.bg}
          >
            <HStack gap={3} mb={3} flexWrap="wrap">
              <Text
                fontSize="2xl"
                fontWeight="700"
                color={styles.border}
                lineHeight="1"
              >
                {styles.mark}
              </Text>
              <Text fontSize="xl" fontWeight="700" color={styles.border}>
                {styles.label}
                {feedback === 'partial' && scorePercent !== null && (
                  <Text as="span" fontSize="md" fontWeight="600" ml={2}>
                    ({scorePercent}% балла)
                  </Text>
                )}
              </Text>
            </HStack>
            <Text color={palette.fg} lineHeight="tall" fontSize="md">
              {feedback === 'incorrect'
                ? explanation.incorrect
                : explanation.correct}
            </Text>
          </Box>
        )}

        {uiState === 'idle' && onCheck && (
          <Box pt={4} borderTopWidth="1px" borderColor={palette.border}>
            <Text fontSize="sm" color={palette.fgMuted} mb={3}>
              {checkHint ??
                (canCheck
                  ? 'Нажмите кнопку, чтобы проверить ответ'
                  : 'Сначала выберите вариант ответа')}
            </Text>
            <button
              type="button"
              data-testid="exercise-check"
              onClick={() => canCheck && onCheck()}
              disabled={!canCheck}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: isTestMode ? '100%' : '320px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '9999px',
                border: `2px solid ${canCheck ? palette.accent : palette.border}`,
                background: canCheck ? palette.accent : palette.surfaceElevated,
                color: canCheck ? palette.onAccent : palette.disabled,
                cursor: canCheck ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
              }}
            >
              Проверить ответ
            </button>
          </Box>
        )}

        {isAnswered && isTestMode && onNext && (
          <Box pt={2}>
            <button
              type="button"
              data-testid="exercise-next"
              onClick={onNext}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '9999px',
                border: `2px solid ${palette.accent}`,
                background: palette.accent,
                color: palette.onAccent,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Далее →
            </button>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
