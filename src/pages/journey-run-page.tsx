import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'

/** Заготовка прохождения (JourneyRunner — этапы 1–3). */
export function JourneyRunPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Box maxW="720px">
      <NavBackLink to="/home" label="На главную" />
      <VStack align="stretch" gap={4} mt={6}>
        <Heading size="xl" color="fg">
          Прохождение journey
        </Heading>
        <Text color="fg.muted">
          ID: <Text as="span" color="accent">{id ?? '—'}</Text>
        </Text>
        <Text color="fg.muted">
          Чекпоинты, таймер и упражнения появятся на этапах 1–3. Сейчас только
          каркас маршрута.
        </Text>
        <Button
          asChild
          alignSelf="flex-start"
          bg="accent"
          color="on.accent"
          fontWeight="600"
          _hover={{ bg: 'accent.hover' }}
        >
          <Link to={`/journey/${id ?? 'demo'}/report`}>К отчёту (заглушка)</Link>
        </Button>
      </VStack>
    </Box>
  )
}
