# Knowledge Journey

Интерактивная система обучения: тема или текст → AI генерирует journey → прохождение под таймером → финальный отчёт.

Стек и визуал основаны на Prompt Lab (Модуль 1): React 19, TypeScript, Vite, Chakra UI v3, палитра `#161616` / `#84CC16`.

Прогресс по этапам: [PROGRESS.md](./PROGRESS.md).

## Локальный запуск

Нужны Node.js 20+ и npm.

```bash
cd "Модуль 2/Knowledge-Journey"
npm install
npm run dev
```

Открыть: http://localhost:5173/home (ширина окна ≥ 1280px).

Опционально API-заглушка (health):

```bash
cp .env.example .env
npm run dev:server
```

Vite проксирует `/api` → `http://localhost:3001`.

## Маршруты (этап 0)

| URL | Экран |
|-----|--------|
| `/` | → `/home` |
| `/home` | Главная |
| `/create` | Создание journey (заглушка) |
| `/generating` | Генерация (заглушка) |
| `/journey/:id` | Прохождение (заглушка) |
| `/journey/:id/report` | Отчёт (заглушка) |

## Команды

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Vite |
| `npm run dev:server` | Hono API (`/api/health`) |
| `npm run build` | Production-сборка |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright smoke |
