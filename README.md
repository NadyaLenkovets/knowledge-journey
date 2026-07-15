# Knowledge Journey

Интерактивная система обучения: тема или текст → AI генерирует journey → прохождение под таймером → финальный отчёт.

Стек: React 19, TypeScript, Vite, Chakra UI v3, Hono (API), OpenRouter free. Визуал Prompt Lab (`#161616` / `#84CC16`).

Прогресс: [PROGRESS.md](./PROGRESS.md).

## Архитектура AI

```
Браузер → POST /api/generate-journey | /api/grade-answer → Hono (server/)
         → Authorization + модель openrouter/free → OpenRouter
```

Ключ только в `.env` на сервере, не в браузере.

## Локальный запуск

Node.js 20+, npm.

```bash
cd "Модуль 2/Knowledge-Journey"
npm install
cp .env.example .env
# вставьте OPENROUTER_API_KEY=sk-or-v1-... из https://openrouter.ai/keys
```

Два процесса:

```bash
npm run dev:server   # API :3001 (читает .env с ключом)
npm run dev          # Vite :5173
```

Или одной командой (нужен ключ в `.env`):

```bash
npm run dev:all
```

Открыть: http://localhost:5173/home (≥ 1280px).

### Demo без ключа

`/create` → **Пройти demo** — без запросов к OpenRouter.

### Live-генерация

1. Заполните тему (≥ 3) или текст (≥ 40 символов).
2. **Сгенерировать journey** → экран генерации → прохождение.
3. Свободные ответы оценивает `/api/grade-answer` (если API доступен; иначе локальный fallback).

Лимиты free OpenRouter: ~20 req/min, ~50/day без депозита.

## Маршруты

| URL | Экран |
|-----|--------|
| `/home` | Главная |
| `/create` | Тема/текст + demo |
| `/generating` | Генерация через API |
| `/journey/:id` | Прохождение |
| `/journey/:id/report` | Отчёт (разбор + печать) |

## Команды

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Vite |
| `npm run dev:server` | Hono с `.env` |
| `npm run dev:all` | Vite + Hono |
| `npm run build` / `lint` / `test` / `test:e2e` | Сборка и проверки |
