import { Box, Heading, HStack, Progress, Text, VStack } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ActivityStep } from '@/components/journey/activity-step'
import { NavBackLink } from '@/components/nav-back-link'
import type { ActivityResult } from '@/types/activity'
import type { Journey } from '@/types/journey'
import { answerStatusProgress, palette } from '@/theme/palette'
import { saveProgress } from '@/store/journey-store'
import { activityTypeLabel, flattenJourney } from '@/utils/journey'

type JourneyRunnerProps = {
  journey: Journey
}

type Phase = 'running' | 'finished'

function statusFromResult(result: ActivityResult): keyof typeof answerStatusProgress {
  if (result.status === 'correct') return 'correct'
  if (result.status === 'partial') return 'partial'
  return 'incorrect'
}

export function JourneyRunner({ journey }: JourneyRunnerProps) {
  const navigate = useNavigate()
  const steps = useMemo(() => flattenJourney(journey), [journey])
  const [phase, setPhase] = useState<Phase>('running')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<ActivityResult[]>([])
  const [awaitingNext, setAwaitingNext] = useState(false)

  const current = steps[currentIndex]
  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const maxScore = results.reduce((s, r) => s + r.maxScore, 0)

  const persist = useCallback(
    (nextResults: ActivityResult[], nextIndex: number, completed: boolean) => {
      saveProgress({
        journeyId: journey.id,
        results: nextResults,
        currentFlatIndex: nextIndex,
        completed,
        updatedAt: new Date().toISOString(),
      })
    },
    [journey.id],
  )

  const handleResult = useCallback(
    (result: ActivityResult) => {
      setResults((prev) => {
        const next = [...prev, result]
        persist(next, currentIndex, false)
        return next
      })
      setAwaitingNext(true)
    },
    [currentIndex, persist],
  )

  const handleNext = useCallback(() => {
    setAwaitingNext(false)
    if (currentIndex + 1 >= steps.length) {
      setResults((prev) => {
        persist(prev, currentIndex, true)
        return prev
      })
      setPhase('finished')
      return
    }
    setCurrentIndex((i) => i + 1)
  }, [currentIndex, persist, steps.length])

  const handleFinishNavigate = () => {
    persist(results, steps.length, true)
    void navigate(`/journey/${journey.id}/report`)
  }

  if (steps.length === 0) {
    return (
      <Box>
        <Text color="fg.muted">В journey нет активностей.</Text>
        <Link to="/home">На главную</Link>
      </Box>
    )
  }

  if (phase === 'finished') {
    const percent =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    return (
      <VStack align="stretch" gap={6} maxW="720px">
        <NavBackLink to="/home" label="На главную" />
        <Heading size="xl" color="fg">
          Journey завершён
        </Heading>
        <Text color="fg.muted">
          {journey.title}: {percent}% · {totalScore.toFixed(1)} / {maxScore}{' '}
          баллов · {results.length} заданий
        </Text>
        <Box
          as="button"
          onClick={handleFinishNavigate}
          alignSelf="flex-start"
          px={5}
          py={3}
          borderRadius="lg"
          bg="accent"
          color="#FFFFFF"
          fontWeight="600"
          cursor="pointer"
          border="none"
          _hover={{ bg: 'accent.hover' }}
        >
          К отчёту →
        </Box>
      </VStack>
    )
  }

  if (!current) return null

  const displayPercent = Math.round(
    ((currentIndex + (awaitingNext ? 1 : 0)) / steps.length) * 100,
  )

  return (
    <VStack align="stretch" gap={6} maxW="800px">
      <NavBackLink to="/create" label="К созданию" />

      <Box>
        <Text fontSize="sm" color="accent" mb={1}>
          Чекпоинт {current.checkpointIndex + 1} из{' '}
          {journey.checkpoints.length}: {current.checkpoint.title}
        </Text>
        <Heading size="lg" color="fg" mb={2}>
          {journey.title}
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {current.checkpoint.concept} · шаг {currentIndex + 1} из{' '}
          {steps.length} · {activityTypeLabel(current.activity.type)}
        </Text>
      </Box>

      <HStack gap={2} flexWrap="wrap" aria-label="Прогресс по шагам">
        {steps.map((step, i) => {
          const done = i < results.length
          let bg: string = answerStatusProgress.pending.bg
          let border: string = answerStatusProgress.pending.border
          let color: string = answerStatusProgress.pending.color
          if (done) {
            const s = answerStatusProgress[statusFromResult(results[i])]
            bg = s.bg
            border = s.border
            color = s.color
          } else if (i === currentIndex) {
            const s = answerStatusProgress.active
            bg = s.bg
            border = s.border
            color = s.color
          }
          return (
            <Box
              key={step.activity.id}
              w="32px"
              h="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              borderWidth="2px"
              borderColor={border}
              bg={bg}
              fontSize="xs"
              fontWeight="700"
              color={color}
              title={activityTypeLabel(step.activity.type)}
            >
              {i + 1}
            </Box>
          )
        })}
      </HStack>

      <Box>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm" color="fg.muted">
            Прогресс
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {displayPercent}%
          </Text>
        </HStack>
        <Progress.Root value={displayPercent} size="sm">
          <Progress.Track bg={palette.surfaceElevated} borderRadius="full">
            <Progress.Range bg={palette.accent} transition="width 0.3s" />
          </Progress.Track>
        </Progress.Root>
        {results.length > 0 && (
          <Text fontSize="sm" color="fg.muted" mt={2}>
            Набрано: {totalScore.toFixed(1)} / {maxScore}
          </Text>
        )}
      </Box>

      <Box>
        <ActivityStep
          key={current.activity.id}
          activity={current.activity}
          onResult={handleResult}
          onNext={handleNext}
        />
      </Box>
    </VStack>
  )
}
