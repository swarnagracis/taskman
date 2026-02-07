# TaskMan

A task management application for assigning, viewing, and updating tasks. Includes authentication, a filterable task list, project summary with performance metrics, and user settings (profile and password).

## Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js, Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt

## Project structure

```
taskman/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # CreateTask, TaskList, Sidebar, ProtectedRoute
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Login, TaskListPage, ProjectSummary, Settings
│   │   └── services/       # authService, taskService
│   └── package.json
├── server/                  # Express API
│   ├── controllers/        # authController, taskController
│   ├── middleware/         # authMiddleware (JWT)
│   ├── models/             # User, Task
│   ├── routes/             # authRoutes, taskRoutes
│   ├── server.js
│   ├── DATABASE.md         # Database structure and relationships
│   └── package.json
└── README.md
```

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=taskman
JWT_SECRET=your-secret-key-min-32-chars
PORT=5000
```

Start the API:

```bash
npm run dev
```

The server runs at `http://localhost:5000`. MongoDB must be running; the app uses database `taskman` and syncs indexes on startup.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173` (or the next free port). It expects the API at `http://localhost:5000` (see `client/src/services/authService.js` and `taskService.js` for `API_URL` if you use a different host/port).

## Features

- **Auth:** Register, login, JWT-protected routes
- **Tasks:** Create tasks (assigned to self by default), list with filters (All / To Do / In Progress / Done), update status
- **Sidebar:** Task List, Project Summary, Settings
- **Project Summary:** Overview cards (total, completed, in progress, to do), completion rate, week-over-week metrics, status distribution
- **Settings:** Update name and email, change password (current + new)

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user profile |
| PATCH | `/api/auth/profile` | Yes | Update name/email |
| POST | `/api/auth/change-password` | Yes | Change password |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks/my` | Yes | My tasks |
| GET | `/api/tasks/stats` | Yes | Task statistics |
| PATCH | `/api/tasks/:id` | Yes | Update task |

## Database

MongoDB database `taskman` with collections:

- **users** – name, email (unique), password (hashed), role
- **tasks** – title, description, status, assignedTo (ref User), createdBy (ref User)

See `server/DATABASE.md` for full schema and indexes.

## License

ISC
