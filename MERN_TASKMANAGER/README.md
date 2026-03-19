<div align="center">

<img src="https://img.shields.io/badge/TaskFlow-MERN%20Task%20Manager-4f8ef7?style=for-the-badge&logo=react&logoColor=white" alt="TaskFlow" />

# ✦ TaskFlow

### Production-Grade Full-Stack Task Manager

[![Live Demo](https://img.shields.io/badge/Live%20Demo-project--mern--ruddy.vercel.app-4f8ef7?style=flat-square&logo=vercel&logoColor=white)](https://project-mern-ruddy.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Render-7c3aed?style=flat-square&logo=render&logoColor=white)](https://project-mern-czks.onrender.com/health)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-10b981?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)](LICENSE)

<br />

**A full-stack task management application built with the MERN stack.**  
Features JWT authentication, role-ready architecture, real-time filtering,  
pagination, and a premium glassmorphism UI with motion design.

<br />

[View Live App](https://project-mern-ruddy.vercel.app) · [API Health Check](https://project-mern-czks.onrender.com/health) · [Report Bug](https://github.com/Vishal-Dubey18/PROJECT_MERN/issues) · [Request Feature](https://github.com/Vishal-Dubey18/PROJECT_MERN/issues)

</div>

---

## 📸 Screenshots

| Login | Dashboard | Create Task |
|-------|-----------|-------------|
| Clean auth UI with animated orbs | Stats bar, filter, task grid | Modal with priority + due date |

---

## ✨ Features

### Core Functionality
- **JWT Authentication** — Register, login, logout with secure token handling
- **Full CRUD** — Create, read, update, delete tasks with instant UI feedback
- **Task Filtering** — Filter by status (pending / completed), search by title/description
- **Sorting** — Newest, oldest, high priority, A→Z
- **Pagination** — Server-side with configurable page size
- **Priority System** — High / Medium / Low with color-coded badges
- **Due Dates** — Set and display due dates per task

### UI / UX
- **Glassmorphism design** — Dark theme with backdrop blur and depth layers
- **Motion system** — Staggered card animations, count-up stat numbers, hover micro-interactions
- **Skeleton loaders** — Shimmer placeholders while data fetches
- **Toast notifications** — Success / error feedback on every action
- **Empty states** — Contextual illustrated empty + error states
- **Fully responsive** — Mobile, tablet, desktop

### Backend / Architecture
- **MVC pattern** — Routes → Controllers → Services → Models
- **Centralized error handler** — Consistent JSON error shape across all routes
- **Input validation** — `express-validator` on every route with detailed error messages
- **Rate limiting** — 200 req/15min global, 20 req/15min on auth routes
- **Security headers** — `helmet.js` + NoSQL injection prevention
- **MongoDB indexes** — Compound indexes on `{ user, status }`, `{ user, createdAt }`, text search

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| React Hot Toast | Toast notifications |
| date-fns | Date formatting |
| CSS Variables | Design system / theming |
| Plus Jakarta Sans | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server + REST API |
| MongoDB + Mongoose | Database + ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing (12 rounds) |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| helmet | Security headers |
| express-mongo-sanitize | NoSQL injection prevention |
| morgan | HTTP request logging |

### Infrastructure
| Service | Purpose | Tier |
|---|---|---|
| MongoDB Atlas | Hosted database | M0 Free |
| Render | Node.js API hosting | Free |
| Vercel | React SPA hosting | Hobby Free |
| GitHub | Source control + CI/CD | Free |

---

## 📁 Project Structure

```
MERN_TASKMANAGER/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Auth req/res handlers
│   │   └── task.controller.js       # Task req/res handlers
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect + requireRole
│   │   ├── errorHandler.js          # Centralised error handler
│   │   ├── rateLimiter.js           # Rate limiting configs
│   │   └── validate.js              # express-validator runner
│   ├── models/
│   │   ├── User.js                  # User schema + bcrypt hooks
│   │   └── Task.js                  # Task schema + indexes
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth endpoints
│   │   └── task.routes.js           # /api/tasks endpoints
│   ├── services/
│   │   ├── auth.service.js          # Auth business logic
│   │   └── task.service.js          # Task business logic + filters
│   ├── utils/
│   │   ├── jwt.js                   # sign / verify helpers
│   │   └── response.js              # Standardised response helpers
│   ├── validators/
│   │   ├── auth.validator.js        # Register / login rules
│   │   └── task.validator.js        # Task CRUD + query rules
│   ├── .env.example                 # Environment variable template
│   ├── package.json
│   └── server.js                    # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── common/
        │   │   ├── Badge.js         # Status + priority pills
        │   │   ├── Button.js        # Reusable button w/ loading state
        │   │   ├── EmptyState.js    # Empty + error state UI
        │   │   ├── Input.js         # Controlled input w/ error display
        │   │   ├── Modal.js         # Accessible modal with ESC close
        │   │   ├── Pagination.js    # Page navigation
        │   │   ├── ProtectedRoute.js# Auth guard HOC
        │   │   SkeletonGrid.js      # Shimmer loading placeholders
        │   │   └── Spinner.js       # Animated loading indicator
        │   ├── layout/
        │   │   └── Navbar.js        # Sticky nav with avatar menu
        │   └── tasks/
        │       ├── FilterBar.js     # Search + status + sort controls
        │       ├── StatsBar.js      # Animated stat cards
        │       ├── TaskCard.js      # Individual task with actions
        │       ├── TaskFormModal.js # Create / edit modal form
        │       └── TaskGrid.js      # Responsive task grid
        ├── context/
        │   └── AuthContext.js       # Global auth state + persistence
        ├── hooks/
        │   ├── useDebounce.js       # Debounce search input
        │   └── useTasks.js          # All task state + CRUD operations
        ├── pages/
        │   ├── Dashboard.js         # Main app page
        │   ├── Login.js             # Login page
        │   └── Register.js          # Registration page
        ├── services/
        │   └── api.js               # Axios instance + interceptors
        ├── styles/
        │   └── global.css           # Design system + animations
        ├── App.js                   # Root component + routing
        └── index.js                 # Entry point
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB running locally **or** a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/Vishal-Dubey18/PROJECT_MERN.git
cd PROJECT_MERN/MERN_TASKMANAGER
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

API running at: `http://localhost:5000`  
Health check: `http://localhost:5000/health`

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App running at: `http://localhost:3000`

---

## 🌐 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create new account |
| `POST` | `/api/auth/login` | ❌ | Login + receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tasks` | ✅ | Get all tasks (filterable) |
| `GET` | `/api/tasks/stats` | ✅ | Get task count by status |
| `GET` | `/api/tasks/:id` | ✅ | Get single task |
| `POST` | `/api/tasks` | ✅ | Create new task |
| `PUT` | `/api/tasks/:id` | ✅ | Update task |
| `DELETE` | `/api/tasks/:id` | ✅ | Delete task |

### Task Query Parameters

```
GET /api/tasks?status=pending&search=design&sortBy=-createdAt&page=1&limit=9
```

| Parameter | Type | Values | Default |
|-----------|------|--------|---------|
| `status` | string | `pending` \| `completed` | all |
| `priority` | string | `low` \| `medium` \| `high` | all |
| `search` | string | any string | — |
| `sortBy` | string | `createdAt` \| `-createdAt` \| `title` \| `-priority` | `-createdAt` |
| `page` | integer | ≥ 1 | `1` |
| `limit` | integer | 1–50 | `9` |

### Example Response

```json
{
  "success": true,
  "message": "Tasks fetched",
  "tasks": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Design new landing page",
      "description": "Update hero section and CTA",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-04-01T00:00:00.000Z",
      "createdAt": "2026-03-19T17:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 24,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## ☁️ Deployment

### Architecture

```
User → Vercel (React SPA) → Render (Express API) → MongoDB Atlas
```

### Environment Variables

**Render (Backend):**

| Variable | Description |
|----------|-------------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random 48-byte hex string |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your Vercel frontend URL |

**Vercel (Frontend):**

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Your Render backend URL + `/api` |

### Generate a secure JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Deploy steps

1. **MongoDB Atlas** — Create free M0 cluster → whitelist `0.0.0.0/0` → copy connection URI
2. **Render** — Connect GitHub repo → Root Directory: `MERN_TASKMANAGER/backend` → add env vars → deploy
3. **Vercel** — Connect GitHub repo → Root Directory: `MERN_TASKMANAGER/frontend` → add `REACT_APP_API_URL` → deploy
4. **Update CORS** — Set `CLIENT_URL` on Render to your Vercel domain

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT stored in `localStorage` with automatic 401 redirect
- **Helmet.js** sets all HTTP security headers
- **express-mongo-sanitize** prevents NoSQL injection
- **Rate limiting** — 20 requests / 15 minutes on auth routes
- Input validation on every route before it reaches the database
- Password field marked `select: false` — never returned in queries

---

## 🗺 Roadmap

- [ ] Drag and drop task reordering
- [ ] Task labels / tags
- [ ] Email notifications for due dates
- [ ] Dark / light mode toggle
- [ ] Admin panel with user management
- [ ] File attachments on tasks
- [ ] Unit + integration tests (Jest + Supertest)
- [ ] Refresh token rotation
- [ ] PWA support

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Vishal Dubey**

[![GitHub](https://img.shields.io/badge/GitHub-Vishal--Dubey18-181717?style=flat-square&logo=github)](https://github.com/Vishal-Dubey18)

---

<div align="center">

Made with ❤️ using the MERN Stack

⭐ Star this repo if you found it helpful!

</div>
