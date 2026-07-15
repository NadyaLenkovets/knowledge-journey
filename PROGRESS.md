# Knowledge Journey — прогресс

Правило: следующий этап только после вашего `принято` / списка правок.

---

## Этап 0–3

- Статус: `accepted`

---

## Этап 4 — Hono + OpenRouter

- Статус: `waiting_review`
- Дата: 2026-07-15

### Сделано

- `server/`: OpenRouter client, enforce free-модели, промпты generate/grade
- `POST /api/generate-journey`, `POST /api/grade-answer`, `GET /api/health`
- Zod + 1 repair-retry при битом JSON
- Фронт: `src/api/client.ts`, экран create с темой/текстом, generating с ошибками и fallback demo
- Свободные ответы / bridge: remote grade если journey ≠ `demo`, иначе локально; при сбое API — локальный fallback
- `npm run dev:all`, README про `.env` и два процесса
- Ключ не уходит в браузер

### Как проверить

1. `cp .env.example .env` → вставить `OPENROUTER_API_KEY`
2. `npm run dev:server:local` и `npm run dev` (или `dev:all`)
3. `/create` — статус «API готов»; ввести тему → **Сгенерировать journey**
4. Пройти свободный ответ — фидбек от API (смотрите Network: только `/api/...`)
5. Без ключа / без server: **Пройти demo** по-прежнему работает
6. `npm run test` / `npm run build`

### Заметки ревью

_(заполняете вы)_

---

## Этапы 5–6

Следующий после приёмки: **Этап 5** — полный отчёт + печать; **Этап 6** — тесты smoke.
