import { Box, Button, Heading, Text, Textarea, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'

/** Заготовка экрана создания journey (логика генерации — этап 4). */
export function CreatePage() {
  return (
    <Box maxW="720px">
      <NavBackLink to="/home" label="На главную" />
      <Heading size="2xl" color="fg" mb={3} mt={4}>
        Новое путешествие
      </Heading>
      <Text color="fg.muted" mb={8}>
        Введите тему или вставьте учебный текст. Генерация через OpenRouter
        появится на следующем этапе; пока можно только осмотреть каркас.
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
          Поле пока отключено — этап 0: только маршруты и бренд.
        </Text>
        <Button
          asChild
          alignSelf="flex-start"
          bg="accent"
          color="on.accent"
          fontWeight="600"
          _hover={{ bg: 'accent.hover' }}
        >
          <Link to="/generating">Далее (заглушка)</Link>
        </Button>
      </VStack>
    </Box>
  )
}
