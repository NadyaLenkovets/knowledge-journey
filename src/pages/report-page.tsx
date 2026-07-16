import '@/styles/print.css'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { NavBackLink } from '@/components/nav-back-link'
import { ReportCheckpointBlockView } from '@/components/report/report-checkpoint-block'
import { ReportNextSteps } from '@/components/report/report-next-steps'
import { ReportSummary } from '@/components/report/report-summary'
import { loadJourney, loadProgress } from '@/store/journey-store'
import { buildJourneyReport } from '@/utils/build-report'

export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const journey = id ? loadJourney(id) : null
  const progress = id ? loadProgress(id) : null
  const report = journey ? buildJourneyReport(journey, progress) : null

  return (
    <Box maxW="800px" className="print-root" data-testid="report-page">
      <Box className="no-print">
        <NavBackLink to={id ? `/journey/${id}` : '/home'} label="К journey" />
      </Box>

      <VStack align="stretch" gap={2} mt={6}>
        {report ? (
          <>
            <ReportSummary report={report} />

            <Box className="no-print" mb={4}>
              <HStack gap={3} flexWrap="wrap">
                <Button
                  bg="accent"
                  color="#FFFFFF"
                  fontWeight="600"
                  _hover={{ bg: 'accent.hover', color: '#FFFFFF' }}
                  onClick={() => window.print()}
                  data-testid="print-report"
                >
                  Печать / PDF
                </Button>
                <Button asChild variant="outline">
                  <Link to="/home">На главную</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/create">Новое путешествие</Link>
                </Button>
              </HStack>
            </Box>

            <Box
              as="section"
              aria-label="Разбор по блокам"
              borderTopWidth="1px"
              borderColor="border"
              pt={6}
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="0.04em"
                mb={4}
              >
                Разбор ответов
              </Text>
              {report.blocks.map((block, index) => (
                <ReportCheckpointBlockView
                  key={block.checkpoint.id}
                  block={block}
                  index={index}
                />
              ))}
            </Box>

            <ReportNextSteps report={report} />
          </>
        ) : (
          <>
            <Text color="fg.muted">
              Нет сохранённого journey. Пройдите demo с экрана создания.
            </Text>
            <Button asChild variant="outline" alignSelf="flex-start" className="no-print">
              <Link to="/create">К созданию</Link>
            </Button>
          </>
        )}
      </VStack>
    </Box>
  )
}
