# ✦ TaskFlow — Production-Grade MERN Task Manager

A full-stack task management app built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
MERN_TASKMANAGER/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js     # Auth req/res handlers
│   │   └── task.controller.js     # Task req/res handlers
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + requireRole
│   │   ├── errorHandler.js        # Central error handler
│   │   ├── rateLimiter.js         # Rate limiting
│   │   └── validate.js            # express-validator runner
│   ├── models/
│   │   ├── User.js                # User schema + password hash
│   │   └── Task.js                # Task schema + indexes
│   ├── routes/
│   │   ├── auth.routes.js         # /api/auth
│   │   └── task.routes.js         # /api/tasks
│   ├── services/
│   │   ├── auth.service.js        # Auth business logic
│   │   └── task.service.js        # Task business logic
│   ├── utils/
│   │   ├── jwt.js                 # sign / verify helpers
│   │   └── response.js            # Standard response helpers
│   ├── validators/
│   │   ├── auth.validator.js      # Register/login rules
│   │   └── task.validator.js      # Task CRUD rules
│   ├── .env                       # Dev environment vars
│   ├── .env.example               # Template for new devs
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.js
│   │   │   │   ├── Button.js
│   │   │   │   ├── EmptyState.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Modal.js
│   │   │   │   ├── Pagination.js
│   │   │   │   ├── ProtectedRoute.js
│   │   │   │   ├── SkeletonGrid.js
│   │   │   │   └── Spinner.js
│   │   │   ├── layout/
│   │   │   │   └── Navbar.js
│   │   │   └── tasks/
│   │   │       ├── FilterBar.js
│   │   │       ├── StatsBar.js
│   │   │       ├── TaskCard.js
│   │   │       ├── TaskFormModal.js
│   │   │       └── TaskGrid.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   └── useTasks.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── .env.production
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Local Setup (Step-by-Step)

### Prerequisites
- Node.js >= 18
- MongoDB running locally OR a MongoDB Atlas URI

---

### 1. Clone / Extract the project

```bash
cd MERN_TASKMANAGER
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` if needed (default values work for local dev):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=taskflow_super_secret_key_change_in_production_32chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start backend (with auto-reload):

```bash
npm run dev
```

✅ API will be at `http://localhost:5000`
✅ Health check: `http://localhost:5000/health`

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

✅ React app will open at `http://localhost:3000`

---

### 4. Connect to MongoDB Atlas (optional)

Replace `MONGO_URI` in `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
```

---

## 🌐 API Reference

### Auth Routes
| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| POST   | /api/auth/register  | ❌   | Create account       |
| POST   | /api/auth/login     | ❌   | Login + get token    |
| GET    | /api/auth/me        | ✅   | Get current user     |

### Task Routes (all protected)
| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | /api/tasks          | Get all tasks (filter/search/paginate)|
| GET    | /api/tasks/stats    | Get task counts by status            |
| GET    | /api/tasks/:id      | Get one task                         |
| POST   | /api/tasks          | Create task                          |
| PUT    | /api/tasks/:id      | Update task                          |
| DELETE | /api/tasks/:id      | Delete task                          |

### Task Query Params
```
GET /api/tasks?status=pending&search=design&sortBy=-createdAt&page=1&limit=9
```

| Param    | Values                                        |
|----------|-----------------------------------------------|
| status   | pending \| completed                          |
| priority | low \| medium \| high                        |
| search   | any string                                    |
| sortBy   | createdAt \| -createdAt \| title \| -priority|
| page     | integer >= 1                                  |
| limit    | integer 1–50                                  |

---

## 🚀 Free Deployment

### Step 1 — MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster (M0 — always free)
3. Create database user + password
4. Whitelist IP: `0.0.0.0/0` (allow all for Render)
5. Copy connection string — looks like:
   ```
   mongodb+srv://user:pass@cluster0.abc.mongodb.net/taskflow
   ```

---

### Step 2 — Render (Backend)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect GitHub repo (or use manual deploy)
3. Settings:
   - **Root directory**: `backend`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
4. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your Atlas URI>
   JWT_SECRET=<strong random 32+ char string>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-app.vercel.app
   ```
5. Deploy → copy your Render URL, e.g. `https://taskflow-api.onrender.com`

---

### Step 3 — Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Settings:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Output directory**: `build`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://taskflow-api.onrender.com/api
   ```
5. Deploy ✅

---

## ⚠️ Common Mistakes & Fixes

| Problem | Fix |
|---------|-----|
| `Cannot connect to MongoDB` | Check `MONGO_URI` in `.env`. Make sure MongoDB is running locally or Atlas IP is whitelisted. |
| `JWT_SECRET is not set` | Add `JWT_SECRET` to `.env`. Never leave it blank. |
| CORS errors in browser | Set `CLIENT_URL` in backend `.env` to exact frontend URL (no trailing slash). |
| `npm run dev` not found | Run `npm install` in the `backend/` folder first. |
| `react-scripts: command not found` | Run `npm install` in the `frontend/` folder first. |
| Render app sleeps after 15 min | Free tier on Render spins down — first request after idle takes ~30s to wake. Normal behaviour. |
| Tasks not loading after deploy | Make sure `REACT_APP_API_URL` in Vercel points to your Render URL, not localhost. |
| Validation errors on task create | `title` is required. `status` must be `pending` or `completed`. `priority` must be `low`, `medium`, or `high`. |

---

## 🔐 Security Features

- Helmet.js (HTTP security headers)
- express-mongo-sanitize (NoSQL injection prevention)
- Rate limiting (200 req/15min global, 20 req/15min auth)
- Input validation on all routes (express-validator)
- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT with configurable expiry
- Password field never returned in API responses (`select: false`)
- CORS restricted to CLIENT_URL only

---

## 🏗️ Architecture Pattern

```
Request → Route → Validator → Middleware → Controller → Service → Model → DB
                                                ↓
                                         errorHandler (centralised)
```

- **Routes**: only define endpoints + attach middleware chains
- **Controllers**: parse req/res, call service, send response
- **Services**: pure business logic, no HTTP knowledge, fully reusable
- **Models**: schema + indexes + instance methods only
