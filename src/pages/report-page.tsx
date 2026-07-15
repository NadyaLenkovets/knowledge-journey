import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'
import { ACHIEVEMENTS } from '@/types/gamification'
import { loadJourney, loadProgress } from '@/store/journey-store'

/** Краткий отчёт; полный UI — этап 5. */
export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const journey = id ? loadJourney(id) : null
  const progress = id ? loadProgress(id) : null

  const totalScore =
    progress?.results.reduce((s, r) => s + r.score, 0) ?? 0
  const maxScore =
    progress?.results.reduce((s, r) => s + r.maxScore, 0) ?? 0
  const percent =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const timeouts =
    progress?.results.filter((r) => r.status === 'timeout').length ?? 0

  return (
    <Box maxW="720px">
      <NavBackLink to={id ? `/journey/${id}` : '/home'} label="К journey" />
      <VStack align="stretch" gap={4} mt={6}>
        <Heading size="xl" color="fg">
          Отчёт о путешествии
        </Heading>
        {journey ? (
          <>
            <Text color="fg.muted">
              <Text as="span" color="accent" fontWeight="600">
                {journey.title}
              </Text>
              {' · '}
              {journey.checkpoints.length} чекпоинтов
            </Text>
            <Text color="fg">
              Результат: {percent}% ({totalScore.toFixed(1)} / {maxScore})
            </Text>
            <Text color="fg">
              Опыт: {progress?.xp ?? 0} XP · серия (лучшая):{' '}
              {progress?.bestStreak ?? 0}
              {timeouts > 0 ? ` · таймаутов: ${timeouts}` : ''}
            </Text>
            {(progress?.unlockedAchievements?.length ?? 0) > 0 && (
              <Text fontSize="sm" color="accent">
                Достижения:{' '}
                {progress!.unlockedAchievements!
                  .map((aid) => ACHIEVEMENTS[aid].title)
                  .join(' · ')}
              </Text>
            )}
            <Text fontSize="sm" color="fg.muted">
              {journey.sourceSummary}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Подробный разбор по ответам и печать — этап 5.
            </Text>
          </>
        ) : (
          <Text color="fg.muted">
            Нет сохранённого journey. Пройдите demo с экрана создания.
          </Text>
        )}
        <Button asChild variant="outline" alignSelf="flex-start">
          <Link to="/home">На главную</Link>
        </Button>
      </VStack>
    </Box>
  )
}
