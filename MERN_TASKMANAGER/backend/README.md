# Backend - TaskManager

## Overview
This directory contains the backend API for the TaskManager application, built with Node.js, Express, and MongoDB.

The backend is responsible for handling API requests, user authentication, and task management.

---

## server.js
- Sets up the Express application.
- Connects to MongoDB using the connection string from environment variables.
- Uses CORS and JSON middleware.
- Registers route modules for authentication (`/api/auth`) and task management (`/api/tasks`).
- Starts the server on the specified port.
- Includes error handling middleware.

---

## Routes

### routes/auth.js
- Handles user registration (`POST /api/auth/register`):
  - Validates email format and username length.
  - Creates a new user and hashes the password.
  - Returns a JWT token on successful registration.
- Handles user login (`POST /api/auth/login`):
  - Accepts username or email as identifier.
  - Verifies password.
  - Returns a JWT token on successful login.

### routes/tasks.js
- Protects routes with JWT authentication middleware.
- Provides CRUD operations for tasks:
  - `POST /api/tasks/`: Create a new task associated with the authenticated user.
  - `GET /api/tasks/`: Retrieve all tasks for the authenticated user.
  - `PUT /api/tasks/:id`: Update a specific task by ID for the authenticated user.
  - `DELETE /api/tasks/:id`: Delete a specific task by ID for the authenticated user.

---

## Models

### models/User.js
- Defines the User schema with fields:
  - `username`: unique, max 10 characters, alphanumeric and underscores only.
  - `email`: unique, validated email format.
  - `password`: hashed before saving.
  - `role`: user role, default is 'user'.
- Includes a static `login` method to authenticate users by username or email and password.

### models/Task.js
- Defines the Task schema with fields:
  - `title`: required string.
  - `description`: optional string.
  - `status`: enum of 'pending' or 'completed', default 'pending'.
  - `dueDate`: required date.
  - `dueTime`: optional string in HH:mm format.
  - `user`: reference to the User who owns the task.
  - `createdAt`: timestamp of creation.

---

## How to Run the Backend

1. Navigate to the backend directory:
   ```bash
   cd MERN_TASKMANAGER/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   - Create a `.env` file in the backend directory.
   - Add the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

4. Start the server:
   ```bash
   node server.js
   ```
   or
   ```bash
   npm start
   ```

5. The server will run on the specified port (default 5000) and connect to MongoDB.

---

This README provides detailed documentation of the backend modules and instructions to run the backend server.

