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

- Статус: `accepted`
- Дата приёмки: 2026-07-16

### Сделано

- Сводка + разбор по блокам + «Печать / PDF» + print CSS
- Эталон после проверки открытых ответов

---

## Этап 6 — Smoke-тесты

- Статус: `accepted`
- Дата приёмки: 2026-07-16

### Сделано

- Playwright smoke: home / create / health mock / demo старт
- Полный прогон demo → «Journey завершён» → отчёт (разбор + print)
- Generating без API → fallback demo
- Helpers: `e2e/helpers/journey-actions.ts` (активности demo)
- `beforeEach`-мок `/api/health` (без proxy noise в preview)
- `npm run test:e2e` (webServer сам делает build + preview)
- Unit: существующие Vitest остаются в `npm run test` / `test:all`

---

## Итог

Этапы **0–6** приняты. MVP Knowledge Journey закрыт по плану этапов.
