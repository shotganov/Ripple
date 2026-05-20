# Frontend

Vite + React 19 + TypeScript SPA.

## Локальный запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Настроить URL бэкенда

Открыть файл `src/shared/config/api.ts` и заменить значение на адрес локального бэкенда:

```ts
// src/shared/config/api.ts

// Было (production):
const VITE_API_BASE_URL = 'https://amiable-exploration-production-5204.up.railway.app/api'

// Заменить на (local):
const VITE_API_BASE_URL = 'http://localhost:3000/api'
```

### 3. Запустить dev-сервер

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## Команды

```bash
npm run dev          # dev-сервер
npm run build        # сборка
npm run lint         # ESLint
npm run test         # тесты
npm run test:cov     # тесты с покрытием
```
