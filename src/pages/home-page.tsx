import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import type { SystemStyleObject } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link } from 'react-router-dom'

const heroTitleReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(6px);
  }
  40% {
    opacity: 0.35;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`

const heroSubtitleReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
  45% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const heroTitleMotion: SystemStyleObject = {
  opacity: 0,
  animation: `${heroTitleReveal} 1.75s cubic-bezier(0.33, 1, 0.68, 1) forwards`,
  willChange: 'opacity, transform, filter',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    opacity: 1,
    transform: 'none',
    filter: 'none',
    willChange: 'auto',
  },
}

const heroSubtitleMotion: SystemStyleObject = {
  opacity: 0,
  animation: `${heroSubtitleReveal} 1.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards`,
  willChange: 'opacity, transform',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    opacity: 1,
    transform: 'none',
    willChange: 'auto',
  },
}

export function HomePage() {
  return (
    <Box>
      <Box
        position="relative"
        py={20}
        textAlign="center"
        borderRadius="2xl"
        overflow="hidden"
        bg="#161616"
        borderWidth="1px"
        borderColor="rgba(132, 204, 22, 0.2)"
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          bg: 'radial-gradient(ellipse 120% 100% at 0% 50%, rgba(132, 204, 22, 0.45) 0%, rgba(63, 98, 18, 0.25) 35%, transparent 70%)',
          pointerEvents: 'none',
        }}
        _after={{
          content: '""',
          position: 'absolute',
          inset: 0,
          bg: 'linear-gradient(105deg, rgba(132, 204, 22, 0.35) 0%, rgba(63, 98, 18, 0.2) 40%, rgba(22, 22, 22, 0.95) 78%)',
          pointerEvents: 'none',
        }}
      >
        <VStack position="relative" zIndex={1} gap={6}>
          <Heading
            size="4xl"
            color="fg"
            fontFamily="'Onest', Inter, system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="-0.03em"
            lineHeight="1.12"
            css={heroTitleMotion}
          >
            Путешествие по знаниям
          </Heading>
          <Text
            fontSize="xl"
            color="fg.muted"
            maxW="640px"
            mx="auto"
            css={heroSubtitleMotion}
          >
            Загрузите тему или текст — система соберёт персональный journey с
            проверкой понимания и финальным отчётом.
          </Text>
          <Box css={heroSubtitleMotion}>
            <Button
              asChild
              size="lg"
              bg="accent"
              color="#FFFFFF"
              fontWeight="600"
              _hover={{ bg: 'accent.hover', color: '#FFFFFF' }}
            >
              <Link to="/create" style={{ color: '#FFFFFF' }}>
                Начать путешествие
              </Link>
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}
