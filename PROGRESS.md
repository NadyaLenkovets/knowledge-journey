# Knowledge Journey — прогресс

Правило: следующий этап только после вашего `принято` / списка правок.

---

## Этап 0–3

- Статус: `accepted`

---

## Этап 4 — Hono + OpenRouter

- Статус: `accepted`
- Дата приёмки: 2026-07-15

### Сделано

- `server/`: OpenRouter client, free-only, generate/grade + normalize JSON
- Фронт create/generating, demo fallback, remote grade для non-demo
- `npm run dev:all`, ключ только в `.env`

---

## Этап 5 — Полный отчёт + печать

- Статус: `waiting_review`
- Дата: 2026-07-15

### Сделано

- Сводка: %, XP, streak / bestStreak, таймауты, достижения с описаниями
- Разбор по блокам: тип, prompt, ответ, статус, score, feedback, explanation / эталон
- Кнопка «Печать / PDF» + `src/styles/print.css` (скрывает header и CTA)
- Утилиты `build-report`, `format-user-answer` + тесты

### Как проверить

1. `npm run dev:all` (или `dev` + `dev:server`)
2. Пройти **demo** (или live journey) до конца → **К отчёту**
3. На `/journey/:id/report` — сводка и разбор ответов с фидбеком
4. **Печать / PDF** — в превью печати нет шапки сайта и кнопок
5. `npm run test` / `npm run build`

### Заметки ревью

_(заполняете вы)_

---

## Этап 6

Следующий после приёмки: smoke-тесты (Vitest/Playwright).
