# Knowledge Journey

Интерактивное учебное SPA: тема или текст → AI собирает journey из блоков → прохождение с таймером, XP и серией → финальный отчёт с разбором и печатью.

Основано на визуале и стеке [Prompt Lab](https://github.com/NadyaLenkovets/prompt-lab) (`#161616` / `#84CC16`). UI на русском. Десктоп **≥ 1280px**.

Прогресс этапов: [PROGRESS.md](./PROGRESS.md) (MVP этапы 0–6 приняты).

## Возможности

- **Demo** без ключа OpenRouter (тема «Галлюцинации LLM»)
- **Live-генерация** через OpenRouter free (`openrouter/free` или `*:free`)
- Чекпоинты с таймером на блок, закрытые и открытые упражнения, `buildTheBridge`
- XP, streak, достижения
- Оценка свободных ответов через `/api/grade-answer` (для demo — локально; при сбое API — fallback)
- Отчёт: %, XP, разбор по блокам, эталон, **Печать / PDF**

## Стек

React 19 · TypeScript · Vite · Chakra UI v3 · Hono · Zod · Vitest · Playwright

## Архитектура AI

```
Браузер  →  /api/* (Vite proxy → :3001)
Hono     →  OpenRouter chat completions (ключ из .env)
```

| Endpoint | Назначение |
|----------|------------|
| `GET /api/health` | Статус API и наличие ключа |
| `POST /api/generate-journey` | Сборка journey по теме/тексту |
| `POST /api/grade-answer` | Оценка свободного ответа |

Ключ **не** попадает в браузер. Ответ модели нормализуется и проверяется Zod (с одним repair-retry).

## Быстрый старт

Нужны Node.js 20+ и npm.

```bash
cd "Модуль 2/Knowledge-Journey"
npm install
```

Создайте файл `.env` в корне и укажите ключ с [openrouter.ai/keys](https://openrouter.ai/keys):

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openrouter/free
PORT=3001
```

Запуск фронта и API:

```bash
npm run dev:all
```

Откройте http://localhost:5173/home

По отдельности:

```bash
npm run dev:server   # API http://localhost:3001
npm run dev          # Vite http://localhost:5173
```

> Без ключа и без API работает **Пройти demo** на `/create`.

## Как пользоваться

### Demo

`/create` → **Пройти demo** → блоки под таймером → **К отчёту**.

### Live

1. Тема (≥ 3 символов) или текст (≥ 40).
2. **Сгенерировать journey** (нужны API + ключ).
3. Пройти journey → отчёт → при желании **Печать / PDF**.

Лимиты free OpenRouter без депозита обычно около **20 req/min** и **50/day** — генерация может занять десятки секунд.

## Маршруты

| URL | Экран |
|-----|--------|
| `/home` | Главная |
| `/create` | Тема / текст, demo, статус API |
| `/generating` | Ожидание генерации (fallback → demo) |
| `/journey/:id` | Прохождение |
| `/journey/:id/report` | Отчёт и печать |

## Команды

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Vite (dev) |
| `npm run dev:server` | Hono API с `.env` |
| `npm run dev:all` | Vite + API |
| `npm run build` | Production-сборка |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (unit) |
| `npm run test:e2e` | Playwright smoke (сам поднимает preview) |
| `npm run test:all` | unit + e2e |

При первом e2e: `npx playwright install chromium`.

## Структура (кратко)

```
src/          # UI, store, схемы, demo-journey
server/       # Hono, OpenRouter, промпты, нормализация JSON
e2e/          # Playwright smoke
```

`.env` в git не коммитится — держите ключ только локально.
