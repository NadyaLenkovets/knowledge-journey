# Knowledge Journey — прогресс

Правило: следующий этап только после вашего `принято` / списка правок.

---

## Этап 0 — репозиторий и каркас

- Статус: `waiting_review`
- Дата: 2026-07-14

### Сделано

- Репозиторий на базе Prompt Lab, пакет `knowledge-journey`
- Бренд в UI: шапка **Knowledge Journey**, hero «Путешествие по знаниям», CTA
- Маршруты KJ: `/home`, `/create`, `/generating`, `/journey/:id`, `/journey/:id/report` (+ редирект `/` и `/main` → `/home`)
- Старые экраны статей/тестов Prompt Lab убраны из роутера и удалены страницы
- Заготовка `server/index.ts` (Hono): `GET /api/health`
- Vite proxy `/api` → `localhost:3001`
- `.env.example`, скрипты `dev:server`, зависимости `hono` / `@hono/node-server` / `tsx`
- E2E: обновлён P0 smoke под новые маршруты; старые PL-specs удалены
- README обновлён под этап 0

Компоненты упражнений и `utils/evaluate-*` сохранены для этапов 1–2 (пока не подключены к новым экранам).

### Как проверить

1. `npm install`
2. `npm run dev` → http://localhost:5173/home  
   - в шапке «Knowledge Journey»  
   - заголовок «Путешествие по знаниям»  
   - кнопка «Начать путешествие» → `/create`
3. Пройти заглушки: Создать → Далее → заглушка прохождения → отчёт
4. (Опционально) `cp .env.example .env` && `npm run dev:server` → открыть http://localhost:3001/api/health — `{"ok":true,...}`
5. `npm run lint` и `npm run build` — без ошибок

### Заметки ревью

_(заполняете вы)_

---

## Этапы 1–6

Ожидают приёмки Этапа 0.
