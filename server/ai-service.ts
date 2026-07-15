import { z } from 'zod'
import { chatCompletion } from './openrouter.ts'
import { extractJsonObject } from './extract-json.ts'
import { normalizeJourneyPayload } from './normalize-journey.ts'
import {
  GENERATE_SYSTEM,
  GRADE_SYSTEM,
  buildGenerateUserMessage,
  buildGradeUserMessage,
} from './prompts.ts'
import { safeParseJourney } from '../src/schemas/journey.ts'

const gradeSchema = z.object({
  score: z.number().min(0).max(1),
  maxScore: z.number().positive().default(1),
  status: z.enum(['correct', 'partial', 'incorrect']),
  feedback: z.string().min(1),
  strengths: z.array(z.string()).optional(),
  gaps: z.array(z.string()).optional(),
})

export type GradePayload = z.infer<typeof gradeSchema>

function formatZodIssues(error: z.ZodError): string {
  return error.issues
    .slice(0, 12)
    .map((i) => {
      const path = i.path.length > 0 ? i.path.join('.') : 'root'
      return `${path}: ${i.message}`
    })
    .join('; ')
}

async function completeJson(
  system: string,
  user: string,
  repairHint?: string,
): Promise<unknown> {
  const messages = [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ]
  if (repairHint) {
    messages.push({
      role: 'user' as const,
      content: `Исправь предыдущий ответ: верни только валидный JSON по схеме. Ошибки: ${repairHint}`,
    })
  }
  const { content } = await chatCompletion(messages, { temperature: 0.2 })
  return extractJsonObject(content)
}

export async function generateJourneyFromAi(input: {
  topic?: string
  text?: string
  size: 'short' | 'medium'
}) {
  const user = buildGenerateUserMessage(input)

  const tryParse = async (raw: unknown) => {
    const normalized = normalizeJourneyPayload(raw)
    const parsed = safeParseJourney(normalized)
    if (!parsed.success) {
      throw new Error(formatZodIssues(parsed.error))
    }
    const journey = parsed.data
    return {
      ...journey,
      id: journey.id || `kj-${Date.now()}`,
      createdAt: journey.createdAt || new Date().toISOString(),
    }
  }

  try {
    const raw = await completeJson(GENERATE_SYSTEM, user)
    return await tryParse(raw)
  } catch (first) {
    const hint = first instanceof Error ? first.message : 'invalid json'
    const raw2 = await completeJson(GENERATE_SYSTEM, user, hint)
    return await tryParse(raw2)
  }
}

export async function gradeAnswerFromAi(input: {
  activityType: string
  prompt: string
  concept?: string
  conceptA?: string
  conceptB?: string
  rubric: string[]
  modelAnswer: string
  userAnswer: string
}): Promise<GradePayload> {
  const user = buildGradeUserMessage(input)

  const tryParse = (raw: unknown) => {
    try {
      return gradeSchema.parse(raw)
    } catch (err) {
      if (err instanceof z.ZodError) throw new Error(formatZodIssues(err))
      throw err
    }
  }

  try {
    const raw = await completeJson(GRADE_SYSTEM, user)
    return tryParse(raw)
  } catch (first) {
    const hint = first instanceof Error ? first.message : 'invalid json'
    const raw2 = await completeJson(GRADE_SYSTEM, user, hint)
    return tryParse(raw2)
  }
}
