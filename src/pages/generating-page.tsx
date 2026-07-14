import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'

/** Заготовка экрана генерации (AI — этап 4). */
export function GeneratingPage() {
  return (
    <Box maxW="640px" mx="auto" textAlign="center" py={16}>
      <NavBackLink to="/create" label="Назад к созданию" />
      <VStack gap={4} mt={8}>
        <Heading size="xl" color="fg">
          Генерация journey…
        </Heading>
        <Text color="fg.muted">
          Здесь будет прогресс разбора материала на чекпоинты. Пока —
          заглушка маршрута.
        </Text>
        <Button
          asChild
          mt={4}
          bg="accent"
          color="on.accent"
          fontWeight="600"
          _hover={{ bg: 'accent.hover' }}
        >
          <Link to="/journey/demo">Открыть заглушку прохождения</Link>
        </Button>
      </VStack>
    </Box>
  )
}
