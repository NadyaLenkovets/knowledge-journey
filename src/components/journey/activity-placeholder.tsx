import { Box, Button, HStack, Text, Textarea, VStack } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import type { ActivityConfig, ActivityResult } from '@/types/activity'
import {
  isBuildTheBridgeActivity,
  isClosedActivity,
  isFreeTextActivity,
} from '@/types/activity'
import { answerStatusStyles, palette } from '@/theme/palette'
import { activityTypeLabel, gradeFreeLocally } from '@/utils/journey'

type ActivityPlaceholderProps = {
  activity: ActivityConfig
  onResult: (result: ActivityResult) => void
  onNext: () => void
  awaitingNext: boolean
}

/**
 * Упрощённый UI шага для этапа 1.
 * Полные компоненты упражнений — этап 2.
 */
export function ActivityPlaceholder({
  activity,
  onResult,
  onNext,
  awaitingNext,
}: ActivityPlaceholderProps) {
  const [text, setText] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [trueFalse, setTrueFalse] = useState<boolean | null>(null)
  const [result, setResult] = useState<ActivityResult | null>(null)

  const statusStyle = useMemo(() => {
    if (!result) return null
    if (result.status === 'timeout' || result.status === 'skipped') {
      return answerStatusStyles.incorrect
    }
    return answerStatusStyles[result.status]
  }, [result])

  const handleCheck = () => {
    if (awaitingNext || result) return

    if (isFreeTextActivity(activity) || isBuildTheBridgeActivity(activity)) {
      const graded = gradeFreeLocally(activity, text)
      setResult(graded)
      onResult(graded)
      return
    }

    if (activity.type === 'singleChoice') {
      const ok = selectedId === activity.correctOptionIds[0]
      const graded: ActivityResult = {
        activityId: activity.id,
        score: ok ? 1 : 0,
        maxScore: 1,
        status: ok ? 'correct' : 'incorrect',
        userAnswer: selectedId,
        feedback: ok
          ? activity.explanation.correct
          : activity.explanation.incorrect,
      }
      setResult(graded)
      onResult(graded)
      return
    }

    if (activity.type === 'trueFalse') {
      const ok = trueFalse === activity.correctAnswer
      const graded: ActivityResult = {
        activityId: activity.id,
        score: ok ? 1 : 0,
        maxScore: 1,
        status: ok ? 'correct' : 'incorrect',
        userAnswer: trueFalse,
        feedback: ok
          ? activity.explanation.correct
          : activity.explanation.incorrect,
      }
      setResult(graded)
      onResult(graded)
      return
    }

    if (activity.type === 'multipleChoice') {
      const correct = new Set(activity.correctOptionIds)
      const picked = new Set(selectedIds)
      const intersection = [...correct].filter((id) => picked.has(id)).length
      const extras = selectedIds.filter((id) => !correct.has(id)).length
      const maxScore = correct.size
      const score = Math.max(0, intersection - extras)
      const ratio = maxScore === 0 ? 0 : score / maxScore
      const status =
        ratio >= 1 ? 'correct' : ratio > 0 ? 'partial' : 'incorrect'
      const graded: ActivityResult = {
        activityId: activity.id,
        score,
        maxScore,
        status,
        userAnswer: selectedIds,
        feedback:
          status === 'correct'
            ? activity.explanation.correct
            : activity.explanation.incorrect,
      }
      setResult(graded)
      onResult(graded)
      return
    }

    // Остальные закрытые типы — заглушка до этапа 2
    const graded: ActivityResult = {
      activityId: activity.id,
      score: 1,
      maxScore: 1,
      status: 'correct',
      userAnswer: 'stub-stage-1',
      feedback:
        'Заглушка этапа 1: полный UI этого типа появится на этапе 2. Балл зачтён, чтобы можно было пройти demo.',
    }
    setResult(graded)
    onResult(graded)
  }

  const canCheck = (() => {
    if (result || awaitingNext) return false
    if (isFreeTextActivity(activity) || isBuildTheBridgeActivity(activity)) {
      return text.trim().length > 0
    }
    if (activity.type === 'singleChoice') return selectedId !== null
    if (activity.type === 'trueFalse') return trueFalse !== null
    if (activity.type === 'multipleChoice') return selectedIds.length > 0
    return true
  })()

  const toggleMulti = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <VStack align="stretch" gap={4}>
      <Text fontSize="sm" color="accent" fontWeight="600">
        {activityTypeLabel(activity.type)}
      </Text>
      <Text fontSize="lg" color="fg" fontWeight="500">
        {activity.prompt}
      </Text>

      {isBuildTheBridgeActivity(activity) && (
        <HStack gap={4} flexWrap="wrap">
          <Box
            flex="1"
            minW="200px"
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            bg="bg.card"
          >
            <Text fontSize="sm" color="fg.muted" mb={1}>
              Концепция A
            </Text>
            <Text color="accent" fontWeight="600">
              {activity.conceptA}
            </Text>
          </Box>
          <Box
            flex="1"
            minW="200px"
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            bg="bg.card"
          >
            <Text fontSize="sm" color="fg.muted" mb={1}>
              Концепция B
            </Text>
            <Text color="accent" fontWeight="600">
              {activity.conceptB}
            </Text>
          </Box>
        </HStack>
      )}

      {(isFreeTextActivity(activity) || isBuildTheBridgeActivity(activity)) && (
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          minH="140px"
          bg="bg.card"
          borderColor="border"
          placeholder="Ваш ответ…"
          disabled={Boolean(result)}
        />
      )}

      {activity.type === 'singleChoice' && (
        <VStack align="stretch" gap={2}>
          {activity.options.map((opt) => (
            <Button
              key={opt.id}
              justifyContent="flex-start"
              variant="outline"
              borderColor={selectedId === opt.id ? 'accent' : 'border'}
              bg={selectedId === opt.id ? 'rgba(132, 204, 22, 0.12)' : 'bg.card'}
              color="fg"
              onClick={() => setSelectedId(opt.id)}
              disabled={Boolean(result)}
            >
              {opt.label}
            </Button>
          ))}
        </VStack>
      )}

      {activity.type === 'multipleChoice' && (
        <VStack align="stretch" gap={2}>
          {activity.options.map((opt) => {
            const on = selectedIds.includes(opt.id)
            return (
              <Button
                key={opt.id}
                justifyContent="flex-start"
                variant="outline"
                borderColor={on ? 'accent' : 'border'}
                bg={on ? 'rgba(132, 204, 22, 0.12)' : 'bg.card'}
                color="fg"
                onClick={() => toggleMulti(opt.id)}
                disabled={Boolean(result)}
              >
                {opt.label}
              </Button>
            )
          })}
        </VStack>
      )}

      {activity.type === 'trueFalse' && (
        <HStack gap={3}>
          <Button
            flex="1"
            variant="outline"
            borderColor={trueFalse === true ? 'accent' : 'border'}
            bg={trueFalse === true ? 'rgba(132, 204, 22, 0.12)' : 'bg.card'}
            color="fg"
            onClick={() => setTrueFalse(true)}
            disabled={Boolean(result)}
          >
            Верно
          </Button>
          <Button
            flex="1"
            variant="outline"
            borderColor={trueFalse === false ? 'accent' : 'border'}
            bg={trueFalse === false ? 'rgba(132, 204, 22, 0.12)' : 'bg.card'}
            color="fg"
            onClick={() => setTrueFalse(false)}
            disabled={Boolean(result)}
          >
            Неверно
          </Button>
        </HStack>
      )}

      {isClosedActivity(activity) &&
        activity.type !== 'singleChoice' &&
        activity.type !== 'multipleChoice' &&
        activity.type !== 'trueFalse' && (
          <Text fontSize="sm" color="fg.muted">
            Полный интерактивный UI ({activityTypeLabel(activity.type)}) — на
            этапе 2. Нажмите «Проверить ответ», чтобы продолжить demo.
          </Text>
        )}

      {statusStyle && result && (
        <Box
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={statusStyle.border}
          bg={statusStyle.cardBg}
        >
          <Text color={statusStyle.color} fontWeight="700" mb={2}>
            {statusStyle.mark} {statusStyle.label}
          </Text>
          {result.feedback && (
            <Text color="fg.muted" fontSize="sm">
              {result.feedback}
            </Text>
          )}
        </Box>
      )}

      <HStack gap={3}>
        {!result && (
          <Button
            bg="accent"
            color="#FFFFFF"
            fontWeight="600"
            _hover={{ bg: 'accent.hover', color: '#FFFFFF' }}
            onClick={handleCheck}
            disabled={!canCheck}
            data-testid="exercise-check"
          >
            Проверить ответ
          </Button>
        )}
        {result && (
          <Button
            bg="accent"
            color="#FFFFFF"
            fontWeight="600"
            _hover={{ bg: 'accent.hover', color: '#FFFFFF' }}
            onClick={onNext}
            data-testid="exercise-next"
          >
            Далее →
          </Button>
        )}
      </HStack>

      {'hint' in activity && activity.hint && !result && (
        <Text fontSize="sm" color={palette.fgMuted}>
          Подсказка: {activity.hint}
        </Text>
      )}
    </VStack>
  )
}
