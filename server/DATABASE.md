# TaskMan – Database Structure (MongoDB)

The backend uses **MongoDB** with **Mongoose**. All data is stored in a single database (default name: **`taskman`**), with two collections and clear relationships between them.

---

## Database

- **Name:** `taskman` (configurable via `MONGO_DB_NAME` in `.env`; falls back to `taskman` if not set)
- **Connection:** Set `MONGO_URI` in `.env`, e.g. `mongodb://localhost:27017` (database name is applied via `dbName` option)

---

## Collections (Tables)

### 1. `users`

Stores user accounts (authentication and profile).

| Field     | Type     | Required | Index   | Description                    |
|----------|----------|----------|---------|--------------------------------|
| `_id`    | ObjectId | auto     | primary | User ID                        |
| `name`   | String   | yes      | —       | Display name (max 120 chars)   |
| `email`  | String   | yes      | unique  | Login email (max 255, lowercase) |
| `password` | String | yes      | —       | Hashed (bcrypt); not returned in JSON |
| `role`   | String   | no       | indexed | `"admin"` or `"member"` (default) |
| `createdAt` | Date  | auto     | —       | Set by Mongoose                |
| `updatedAt` | Date  | auto     | —       | Set by Mongoose                |

**Indexes:**

- `{ email: 1 }` – unique (login, register, uniqueness checks)
- `{ role: 1 }` – for filtering by role if needed

**Relationships:**

- Referenced by **tasks** as `assignedTo` and `createdBy`.

---

### 2. `tasks`

Stores tasks assigned to users.

| Field        | Type     | Required | Index   | Description                          |
|-------------|----------|----------|---------|--------------------------------------|
| `_id`       | ObjectId | auto     | primary | Task ID                              |
| `title`     | String   | yes      | —       | Task title (max 200 chars)           |
| `description` | String | no       | —       | Optional details (max 2000 chars)    |
| `status`    | String   | no       | —       | `"To Do"`, `"In Progress"`, or `"Done"` (default: `"To Do"`) |
| `assignedTo`| ObjectId | yes      | yes     | **Ref: users._id** – who the task is assigned to |
| `createdBy` | ObjectId | no       | yes     | **Ref: users._id** – who created the task |
| `createdAt` | Date     | auto     | —       | Set by Mongoose                     |
| `updatedAt` | Date     | auto     | —       | Set by Mongoose                     |

**Indexes:**

- `{ assignedTo: 1, updatedAt: -1 }` – list “my tasks” sorted by last updated
- `{ assignedTo: 1, status: 1 }` – filter by assignee and status (stats, filters)
- `{ assignedTo: 1 }` – single-field index on assignee
- `{ createdBy: 1 }` – list tasks by creator

**Relationships:**

- **assignedTo** → `users._id` (many tasks per user)
- **createdBy** → `users._id` (many tasks per user)

---

## Relationship Diagram

```
┌─────────────────┐                    ┌─────────────────┐
│     users       │                    │     tasks       │
├─────────────────┤                    ├─────────────────┤
│ _id (ObjectId)  │◄─── assignedTo ───│ assignedTo      │
│ name            │                    │ createdBy       │
│ email (unique)  │◄─── createdBy  ────│ title           │
│ password        │                    │ description     │
│ role            │                    │ status          │
│ createdAt       │                    │ createdAt       │
│ updatedAt       │                    │ updatedAt       │
└─────────────────┘                    └─────────────────┘
```

- One user can have **many tasks** (as assignee and as creator).
- Each task has exactly one **assignedTo** user and optionally one **createdBy** user.

---

## How the app uses the data

- **Auth:** Register creates a **User**; login finds by **email** and checks **password**.
- **Tasks:** Create task with **assignedTo** (default current user) and **createdBy** (current user). List tasks by **assignedTo**; update uses **assignedTo** for ownership check. Stats aggregate by **assignedTo** and **status** / **updatedAt**.

Indexes are created/synced on server startup so the database is ready for these operations.
