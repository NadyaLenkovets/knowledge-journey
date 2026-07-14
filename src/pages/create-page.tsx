import { Box, Button, Heading, Text, Textarea, VStack } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'
import { getDemoJourney } from '@/content/demo/demo-journey'
import {
  createEmptyProgress,
  saveJourney,
  saveProgress,
} from '@/store/journey-store'

export function CreatePage() {
  const navigate = useNavigate()

  const startDemo = () => {
    const journey = getDemoJourney()
    saveJourney(journey)
    saveProgress(createEmptyProgress(journey.id))
    void navigate(`/journey/${journey.id}`)
  }

  return (
    <Box maxW="720px">
      <NavBackLink to="/home" label="На главную" />
      <Heading size="2xl" color="fg" mb={3} mt={4}>
        Новое путешествие
      </Heading>
      <Text color="fg.muted" mb={8}>
        Введите тему или вставьте учебный текст. Генерация через OpenRouter —
        на этапе 4. Сейчас доступен готовый demo-journey без API.
      </Text>

      <VStack align="stretch" gap={4}>
        <Textarea
          placeholder="Например: галлюцинации больших языковых моделей…"
          minH="180px"
          bg="bg.card"
          borderColor="border"
          disabled
        />
        <Text fontSize="sm" color="fg.muted">
          Поле ввода заработает вместе с AI-генерацией (этап 4).
        </Text>

        <Button
          alignSelf="flex-start"
          bg="accent"
          color="#FFFFFF"
          fontWeight="600"
          _hover={{ bg: 'accent.hover', color: '#FFFFFF' }}
          onClick={startDemo}
          data-testid="start-demo"
        >
          Пройти demo
        </Button>

        <Button
          asChild
          alignSelf="flex-start"
          variant="outline"
          borderColor="border"
          color="fg.muted"
        >
          <Link to="/generating">Заглушка генерации →</Link>
        </Button>
      </VStack>
    </Box>
  )
}
