# Система управления дефектами (Defect Management System)

Веб-приложение для управления дефектами и проектами с ролевой моделью доступа, отчетностью и аналитикой.

## 📋 Содержание

- [Описание проекта](#описание-проекта)
- [Функциональные возможности](#функциональные-возможности)
- [Технологический стек](#технологический-стек)
- [Архитектура системы](#архитектура-системы)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [API документация](#api-документация)
- [Модели данных](#модели-данных)
- [Роли пользователей](#роли-пользователей)

---

## 🎯 Описание проекта

Система управления дефектами — это полнофункциональное веб-приложение для отслеживания и управления дефектами в рамках различных проектов. Система предоставляет возможности для создания проектов, регистрации дефектов, назначения исполнителей, отслеживания статусов и генерации аналитических отчетов.

### Основные возможности:
- ✅ Управление проектами и дефектами
- 👥 Ролевая модель доступа (Наблюдатель, Инженер, Менеджер)
- 🔐 JWT-аутентификация и авторизация
- 📊 Аналитика и отчетность по проектам
- 📄 Экспорт данных в CSV
- 🔍 Поиск и фильтрация дефектов
- 📎 Прикрепление файлов к дефектам

---

## 🚀 Функциональные возможности

### Управление проектами
- Создание, редактирование и удаление проектов
- Просмотр списка всех проектов
- Отслеживание стадий разработки проектов
- Просмотр дефектов по проекту

### Управление дефектами
- Создание дефектов с полным описанием
- Установка приоритета (низкий, средний, высокий)
- Управление статусами (новый, в работе, на проверке, закрыт, отменен)
- Назначение ответственных исполнителей
- Установка сроков выполнения
- Прикрепление файлов к дефектам
- Поиск по названию и описанию

### Отчетность и аналитика
- Статистика по проектам:
  - Общее количество дефектов
  - Распределение по статусам
  - Распределение по приоритетам
  - Процент выполнения
  - Дефекты по исполнителям
- Экспорт данных в CSV формат

### Система ролей
- **Наблюдатель (Observer)**: только просмотр
- **Инженер (Engineer)**: создание и редактирование дефектов
- **Менеджер (Manager)**: полный доступ ко всем функциям

---

## 💻 Технологический стек

### Frontend
- **React** 18.3.1 - библиотека для построения UI
- **React Router** 7.8.2 - маршрутизация
- **React Bootstrap** 2.10.10 - UI-компоненты
- **Bootstrap** 5.3.3 - CSS-фреймворк

### Backend
- **Node.js** - серверная платформа
- **Express** 5.1.0 - веб-фреймворк
- **Sequelize** 6.37.7 - ORM для работы с БД
- **PostgreSQL** - реляционная база данных
- **JWT** (jsonwebtoken 9.0.2) - аутентификация
- **bcrypt** 6.0.0 - хеширование паролей
- **multer** 2.0.2 - загрузка файлов
- **json2csv** 6.0.0 - экспорт в CSV

### Дополнительные инструменты
- **CORS** - кросс-доменные запросы
- **Helmet** - безопасность HTTP-заголовков
- **Morgan** - логирование HTTP-запросов
- **dotenv** - управление переменными окружения

---

## 🏗️ Архитектура системы

Система построена по трехуровневой архитектуре:

### 1. Уровень представления (Presentation Layer)
- React-приложение с компонентной архитектурой
- Использование Context API для управления состоянием авторизации
- React Router для навигации
- Bootstrap для адаптивного UI

### 2. Уровень бизнес-логики (Business Logic Layer)
- Express.js сервер с RESTful API
- Middleware для аутентификации и авторизации
- Контроллеры для обработки бизнес-логики
- Валидация данных

### 3. Уровень данных (Data Layer)
- PostgreSQL база данных
- Sequelize ORM для работы с моделями
- Связи между таблицами (один-ко-многим)

### Паттерны проектирования
- **MVC** (Model-View-Controller)
- **Repository Pattern** (через Sequelize)
- **Middleware Pattern** (для аутентификации)
- **Context API** (для глобального состояния)

---

## 📦 Установка и запуск

### Требования
- Node.js 14+
- PostgreSQL 12+
- npm или yarn

### 1. Клонирование репозитория
```bash
git clone https://github.com/darklaitt/defect-management-system.git
cd defect-management-system
```

### 2. Установка Backend

```bash
cd backend
npm install
```

Создайте файл `.env` в папке `backend`:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/defect_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Создайте базу данных:
```bash
createdb defect_db
```

Запустите сервер:
```bash
npm start          # Продакшн
npm run dev        # Разработка с nodemon
```

### 3. Установка Frontend

```bash
cd frontend
npm install
```

Создайте файл `.env` в папке `frontend`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Запустите приложение:
```bash
npm start
```

Приложение откроется по адресу: [http://localhost:3000](http://localhost:3000)

---

## 📁 Структура проекта

```
defect-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Конфигурация БД, JWT, ролей
│   │   ├── controllers/     # Контроллеры бизнес-логики
│   │   ├── middleware/      # Middleware (auth, roles, upload, errors)
│   │   ├── models/          # Sequelize модели
│   │   ├── routes/          # Маршруты API
│   │   └── app.js           # Настройка Express
│   ├── uploads/             # Загруженные файлы
│   ├── server.js            # Точка входа сервера
│   └── package.json
│
└── frontend/
    ├── public/              # Статические файлы
    ├── src/
    │   ├── components/      # React компоненты
    │   ├── context/         # Context API (AuthContext)
    │   ├── pages/           # Страницы приложения
    │   ├── styles/          # CSS стили
    │   ├── utils/           # Утилиты (локализация)
    │   ├── App.js           # Главный компонент
    │   └── index.js         # Точка входа React
    └── package.json
```

---

## 🔌 API документация

### Аутентификация

#### Регистрация
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "password": "securepass",
  "email": "user@example.com",
  "fullName": "Иван Иванов",
  "role": "engineer"
}
```

#### Вход
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "securepass"
}
```

Ответ:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user123",
    "role": "engineer",
    "fullName": "Иван Иванов"
  }
}
```

### Проекты

#### Получить все проекты
```http
GET /api/projects
Authorization: Bearer {token}
```

#### Создать проект
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Проект А",
  "description": "Описание проекта",
  "stage": "development"
}
```

#### Обновить проект
```http
PUT /api/projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Новое название",
  "description": "Новое описание",
  "stage": "testing"
}
```

#### Удалить проект
```http
DELETE /api/projects/:id
Authorization: Bearer {token}
```

### Дефекты

#### Получить все дефекты
```http
GET /api/defects?search=текст_поиска
Authorization: Bearer {token}
```

#### Получить дефект по ID
```http
GET /api/defects/:id
Authorization: Bearer {token}
```

#### Создать дефект
```http
POST /api/defects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Название дефекта",
  "description": "Подробное описание",
  "priority": "high",
  "status": "new",
  "dueDate": "2025-12-31",
  "projectId": 1,
  "assigneeId": 2
}
```

#### Обновить дефект
```http
PUT /api/defects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Обновленное название",
  "status": "in_progress",
  "priority": "medium"
}
```

#### Удалить дефект
```http
DELETE /api/defects/:id
Authorization: Bearer {token}
```

#### Прикрепить файл к дефекту
```http
POST /api/defects/:id/attachments
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
```

### Отчеты

#### Получить отчет по проекту
```http
GET /api/reports/projects/:projectId
Authorization: Bearer {token}
```

Ответ:
```json
{
  "project": {
    "id": 1,
    "name": "Проект А",
    "description": "Описание",
    "stage": "development"
  },
  "statistics": {
    "totalDefects": 45,
    "completionRate": 67,
    "byStatus": {
      "new": 5,
      "in_progress": 10,
      "review": 3,
      "closed": 25,
      "cancelled": 2
    },
    "byPriority": {
      "low": 15,
      "medium": 20,
      "high": 10
    },
    "byAssignee": {
      "engineer1": 12,
      "engineer2": 18,
      "Не назначен": 15
    }
  },
  "defects": [...]
}
```

#### Экспорт дефектов в CSV
```http
GET /api/reports/projects/:projectId/export
Authorization: Bearer {token}
```

---

## 🗄️ Модели данных

### User (Пользователь)
```javascript
{
  id: Integer (PK, AUTO_INCREMENT),
  username: String (UNIQUE, NOT NULL),
  password: String (NOT NULL, hashed),
  role: Enum ('observer', 'engineer', 'manager'),
  fullName: String,
  email: String (UNIQUE),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Project (Проект)
```javascript
{
  id: Integer (PK, AUTO_INCREMENT),
  name: String (NOT NULL),
  description: Text,
  stage: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Defect (Дефект)
```javascript
{
  id: Integer (PK, AUTO_INCREMENT),
  title: String (NOT NULL),
  description: Text,
  priority: Enum ('low', 'medium', 'high'),
  status: Enum ('new', 'in_progress', 'review', 'closed', 'cancelled'),
  dueDate: Date,
  projectId: Integer (FK → Projects.id),
  assigneeId: Integer (FK → Users.id),
  createdById: Integer (FK → Users.id),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Attachment (Вложение)
```javascript
{
  id: Integer (PK, AUTO_INCREMENT),
  filename: String (NOT NULL),
  path: String (NOT NULL),
  defectId: Integer (FK → Defects.id),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Связи между моделями
- `Project` → `Defect` (один-ко-многим)
- `User` → `Defect` (assignee, один-ко-многим)
- `User` → `Defect` (createdBy, один-ко-многим)
- `Defect` → `Attachment` (один-ко-многим)

---

## 👥 Роли пользователей

### Observer (Наблюдатель)
**Права доступа:**
- ✅ Просмотр проектов
- ✅ Просмотр дефектов
- ✅ Просмотр отчетов
- ❌ Создание/редактирование/удаление

**Применение:** Заказчики, аудиторы, стейкхолдеры

### Engineer (Инженер)
**Права доступа:**
- ✅ Все права Наблюдателя
- ✅ Создание дефектов
- ✅ Редактирование дефектов
- ✅ Изменение статусов дефектов
- ✅ Прикрепление файлов
- ❌ Удаление дефектов
- ❌ Управление проектами
- ❌ Экспорт отчетов

**Применение:** Разработчики, QA-инженеры, тестировщики

### Manager (Менеджер)
**Права доступа:**
- ✅ Все права Инженера
- ✅ Создание проектов
- ✅ Редактирование проектов
- ✅ Удаление дефектов и проектов
- ✅ Назначение исполнителей
- ✅ Экспорт отчетов в CSV
- ✅ Полный доступ к аналитике

**Применение:** Проектные менеджеры, тимлиды, руководители

---

## 🎨 UML-диаграммы

### Диаграмма вариантов использования (Use Case)

**Актеры:**
- Наблюдатель (Observer)
- Инженер (Engineer)
- Менеджер (Manager)

**Основные сценарии:**
1. Аутентификация и авторизация
2. Управление проектами
3. Управление дефектами
4. Просмотр аналитики и отчетов
5. Экспорт данных

### Диаграмма классов

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ - id            │
│ - username      │
│ - password      │
│ - role          │
│ - fullName      │
│ - email         │
└────────┬────────┘
         │
         │ 1:N (assignee)
         │ 1:N (createdBy)
         ▼
┌─────────────────┐       ┌─────────────────┐
│    Project      │ 1:N   │     Defect      │ 1:N
├─────────────────┤◄──────┤─────────────────┤◄─────┐
│ - id            │       │ - id            │      │
│ - name          │       │ - title         │      │
│ - description   │       │ - description   │      │
│ - stage         │       │ - priority      │      │
└─────────────────┘       │ - status        │      │
                          │ - dueDate       │      │
                          │ - projectId     │      │
                          │ - assigneeId    │      │
                          │ - createdById   │      │
                          └─────────────────┘      │
                                                   │
                          ┌─────────────────┐      │
                          │   Attachment    │──────┘
                          ├─────────────────┤
                          │ - id            │
                          │ - filename      │
                          │ - path          │
                          │ - defectId      │
                          └─────────────────┘
```

### ER-диаграмма базы данных (Crow's Foot)

```
Users ||--o{ Defects : "assignee"
Users ||--o{ Defects : "createdBy"
Projects ||--o{ Defects : "contains"
Defects ||--o{ Attachments : "has"
```

---

## 🔐 Безопасность

- **JWT токены** для аутентификации
- **bcrypt** для хеширования паролей (10 раундов)
- **Helmet** для защиты HTTP-заголовков
- **CORS** с ограничением источников
- **Валидация** всех входных данных
- **Middleware** для проверки ролей

---

## 📝 Лицензия

Этот проект разработан для образовательных целей.

---

## 👨‍💻 Автор

**darklaitt**  
GitHub: [github.com/darklaitt](https://github.com/darklaitt)

---

## 📞 Контакты

По всем вопросам обращайтесь через GitHub Issues.

---

**Дата последнего обновления:** 7 октября 2025 г.
