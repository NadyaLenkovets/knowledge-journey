import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'

/** Заготовка финального отчёта (полный UI — этап 5). */
export function ReportPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Box maxW="720px">
      <NavBackLink to={`/journey/${id ?? 'demo'}`} label="К journey" />
      <VStack align="stretch" gap={4} mt={6}>
        <Heading size="xl" color="fg">
          Отчёт о путешествии
        </Heading>
        <Text color="fg.muted">
          Сводка баллов, слабые зоны и печать появятся на этапе 5. Journey:{' '}
          <Text as="span" color="accent">
            {id ?? '—'}
          </Text>
        </Text>
        <Button asChild variant="outline" alignSelf="flex-start">
          <Link to="/home">На главную</Link>
        </Button>
      </VStack>
    </Box>
  )
}
