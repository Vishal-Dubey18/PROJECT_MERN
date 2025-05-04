# PROJECT_MERN
# PROJECT_MERN# TaskManager Project

## Project Overview
TaskManager is a MERN stack application designed to manage tasks with user authentication. It consists of a backend API built with Node.js, Express, and MongoDB, and a frontend built with React.

The project is structured into two main parts: the backend API and the frontend React application.

---

## Backend Modules

### server.js
- Sets up the Express application.
- Connects to MongoDB using the connection string from environment variables.
- Uses CORS and JSON middleware.
- Registers route modules for authentication (`/api/auth`) and task management (`/api/tasks`).
- Starts the server on the specified port.
- Includes error handling middleware.

### Routes

#### routes/auth.js
- Handles user registration (`POST /api/auth/register`):
  - Validates email format and username length.
  - Creates a new user and hashes the password.
  - Returns a JWT token on successful registration.
- Handles user login (`POST /api/auth/login`):
  - Accepts username or email as identifier.
  - Verifies password.
  - Returns a JWT token on successful login.

#### routes/tasks.js
- Protects routes with JWT authentication middleware.
- Provides CRUD operations for tasks:
  - `POST /api/tasks/`: Create a new task associated with the authenticated user.
  - `GET /api/tasks/`: Retrieve all tasks for the authenticated user.
  - `PUT /api/tasks/:id`: Update a specific task by ID for the authenticated user.
  - `DELETE /api/tasks/:id`: Delete a specific task by ID for the authenticated user.

### Models

#### models/User.js
- Defines the User schema with fields:
  - `username`: unique, max 10 characters, alphanumeric and underscores only.
  - `email`: unique, validated email format.
  - `password`: hashed before saving.
  - `role`: user role, default is 'user'.
- Includes a static `login` method to authenticate users by username or email and password.

#### models/Task.js
- Defines the Task schema with fields:
  - `title`: required string.
  - `description`: optional string.
  - `status`: enum of 'pending' or 'completed', default 'pending'.
  - `dueDate`: required date.
  - `dueTime`: optional string in HH:mm format.
  - `user`: reference to the User who owns the task.
  - `createdAt`: timestamp of creation.

---

## Frontend Modules

### Entry Point

#### src/index.js
- Renders the React application.
- Wraps the main `App` component with `BrowserRouter` for routing and `AuthProvider` for authentication context.

### Main Application

#### src/App.js
- Defines routes using React Router:
  - `/`: Protected route rendering `Dashboard` if authenticated, otherwise redirects to `/login`.
  - `/login`: Login page.
  - `/register`: Registration page.
- Includes a `Navbar` component visible on all pages.

### Context

#### src/context/AuthContext.js
- Provides authentication state and functions:
  - Stores JWT token in localStorage.
  - `login(token)`: saves token and sets user state.
  - `logout()`: removes token and clears user state.
- Exposes `useAuth` hook for accessing auth context.

### Components

- `src/components/Navbar.js`: Navigation bar with links and user info.
- `src/components/TaskForm.js`: Form for creating or editing tasks.
- `src/components/TaskList.js`: Displays a list of tasks with options to update or delete.

### Pages

- `src/pages/Login.js`: User login form and logic.
- `src/pages/Register.js`: User registration form and logic.
- `src/pages/Dashboard.js`: Displays user tasks and task management UI.

---

## Running the Project

### Backend
1. Navigate to `MERN_TASKMANAGER/backend`
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set environment variables in a `.env` file or system environment:  
   - `MONGO_URI`: MongoDB connection string  
   - `JWT_SECRET`: Secret key for JWT token signing
4. Start the server:  
   ```bash
   node server.js
   ```
   or  
   ```bash
   npm start
   ```

### Frontend
1. Navigate to `MERN_TASKMANAGER/frontend`
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the React app:  
   ```bash
   npm start
   ```

---

## Accessing Modules

- Backend modules are organized under the `backend` directory:
  - `models/` contains data schemas.
  - `routes/` contains API endpoints.
  - `server.js` initializes the app and connects modules.

- Frontend modules are under the `frontend/src` directory:
  - `components/` contains reusable UI components.
  - `context/` contains React context providers.
  - `pages/` contains route-specific page components.
  - `App.js` defines routing and layout.

- Authentication is handled via JWT tokens:
  - Backend verifies tokens in protected routes.
  - Frontend stores tokens in localStorage and manages auth state via context.

---

This README provides a detailed overview to help developers understand, navigate, and contribute to the TaskManager codebase efficiently.
