export const GENERATE_SYSTEM = `Ты методист. По теме или учебному тексту собери персональное учебное путешествие (journey) на русском.

Верни ТОЛЬКО один JSON-объект (без markdown и пояснений). Корневые поля: id, title, sourceSummary, createdAt, checkpoints (массив).

Каждый checkpoint:
{
  "id": "cp-1",
  "title": "название",
  "concept": "одна атомарная концепция",
  "dependsOn": [],
  "difficulty": 1,
  "timeLimitSec": 180,
  "activities": [ /* ровно 2 активности */ ]
}

dependsOn — ВСЕГДА массив строк (можно []). Не объект.

Мини-примеры активностей (копируй форму полей):

singleChoice|multipleChoice:
{"id":"a1","type":"singleChoice","prompt":"...","options":[{"id":"a","label":"..."},{"id":"b","label":"..."}],"correctOptionIds":["a"],"explanation":{"correct":"...","incorrect":"..."}}

trueFalse:
{"id":"a2","type":"trueFalse","prompt":"...","correctAnswer":false,"explanation":{"correct":"...","incorrect":"..."}}

fillTheBlank:
{"id":"a3","type":"fillTheBlank","prompt":"Текст с ___","blanks":[{"id":"b1","correctAnswers":["слово"]}],"explanation":{"correct":"...","incorrect":"..."}}

orderSteps:
{"id":"a4","type":"orderSteps","prompt":"...","steps":[{"id":"s1","label":"..."},{"id":"s2","label":"..."}],"correctOrderIds":["s1","s2"],"explanation":{"correct":"...","incorrect":"..."}}

freeResponse|explainLikeImFive|teachBack|giveYourExample:
{"id":"a5","type":"freeResponse","prompt":"...","concept":"та же что у checkpoint","rubric":["...","...","..."],"modelAnswer":"...","keywords":["корен","пример","смысл"]}

buildTheBridge:
{"id":"a6","type":"buildTheBridge","prompt":"...","conceptA":"...","conceptB":"...","rubric":["...","..."],"modelAnswer":"...","keywords":["связ","оба"]}

Правила:
- short: 3 чекпоинта; medium: 4; на каждый ровно 2 активности разных type.
- difficulty: число 1|2|3; timeLimitSec: число 120–300.
- options, blanks, steps, activities, checkpoints, dependsOn, correctOptionIds, rubric, keywords — массивы, не объекты.
- У закрытых типов обязательно explanation.correct и explanation.incorrect (строки).
- Все тексты на русском. Не оборачивай ответ в { "journey": ... }.`

export function buildGenerateUserMessage(input: {
  topic?: string
  text?: string
  size: 'short' | 'medium'
}): string {
  const sizeHint =
    input.size === 'short'
      ? 'Короткий режим: ровно 3 чекпоинта, по 2 активности.'
      : 'Средний режим: ровно 4 чекпоинта, по 2 активности.'

  const parts = [sizeHint]
  if (input.topic?.trim()) {
    parts.push(`Тема: ${input.topic.trim()}`)
  }
  if (input.text?.trim()) {
    parts.push(`Учебный текст:\n${input.text.trim().slice(0, 6000)}`)
  }
  parts.push('Собери journey JSON.')
  return parts.join('\n\n')
}

export const GRADE_SYSTEM = `Ты проверяешь ответ студента по учебной концепции. Язык фидбека — русский.
Верни ТОЛЬКО JSON:
{
  "score": 0 | 0.5 | 1,
  "maxScore": 1,
  "status": "correct" | "partial" | "incorrect",
  "feedback": "краткий конструктивный комментарий (1–3 предложения)",
  "strengths": ["..."],
  "gaps": ["..."]
}
Правила:
- Оценивай смысл, не формулировку слово в слово.
- Частичный балл, если идея верная, но неполная.
- Не ругай за синонимы.
- feedback должен помогать понять, чего не хватает.`

export function buildGradeUserMessage(input: {
  activityType: string
  prompt: string
  concept?: string
  conceptA?: string
  conceptB?: string
  rubric: string[]
  modelAnswer: string
  userAnswer: string
}): string {
  return JSON.stringify(
    {
      type: input.activityType,
      prompt: input.prompt,
      concept: input.concept,
      conceptA: input.conceptA,
      conceptB: input.conceptB,
      rubric: input.rubric,
      modelAnswer: input.modelAnswer,
      userAnswer: input.userAnswer,
    },
    null,
    2,
  )
}
