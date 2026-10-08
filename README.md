# Питомник мейн-кунов «Тихий Дом»

Семейный питомник мейн-кунов. Здоровые, спокойные котята-компаньоны для семьи.

## Технологии

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui**
- **Prisma ORM** + **SQLite**
- **Socket.io** (real-time availability)
- **next-themes** (тёмная тема)

## Установка

```bash
# 1. Установить зависимости
bun install

# 2. Скопировать .env.example в .env и заполнить
cp .env.example .env

# 3. Применить схему базы данных
bun run db:push

# 4. Заполнить базу тестовыми данными
bun prisma/seed.ts

# 5. Запустить dev-сервер
bun run dev
```

Сайт будет доступен на `http://localhost:3000`

## Структура

```
src/
  app/              # Next.js App Router страницы и API-роуты
  components/
    cattery/        # Компоненты сайта питомника
    ui/             # shadcn/ui компоненты
  hooks/            # React хуки
  lib/              # Утилиты (db, blur, types)
mini-services/
  availability-service/  # WebSocket сервис (порт 3003)
prisma/
  schema.prisma     # Схема базы данных
  seed.ts           # Начальные данные
```

## Команды

| Команда | Описание |
|---------|----------|
| `bun run dev` | Запуск dev-сервера (порт 3000) |
| `bun run lint` | Проверка кода ESLint |
| `bun run db:push` | Применить схему к БД |
| `bun run db:generate` | Регенерация Prisma Client |
| `bun prisma/seed.ts` | Заполнить БД тестовыми данными |

## Лицензия

© 2026 Питомник «Тихий Дом». Все права защищены.
