# Frontend - TaskManager

## Overview
This directory contains the frontend React application for the TaskManager project. It provides the user interface for user authentication and task management.

The frontend is built with React, React Router, and Bootstrap. It communicates with the backend API to authenticate users and manage tasks.

---

## File Structure and Details

### src/
- Contains the main source code for the React app.

#### src/App.js
- Main app component.
- Sets up routing using React Router.
- Uses `AuthContext` to manage authentication state.
- Routes:
  - `/`: Dashboard page (protected, redirects to login if not authenticated).
  - `/login`: Login page.
  - `/register`: Registration page.
- Includes the `Navbar` component on all pages.

#### src/index.js
- Entry point of the React app.
- Wraps the app with `BrowserRouter` for routing and `AuthProvider` for authentication context.

#### src/context/AuthContext.js
- Provides authentication state and functions via React Context.
- Stores JWT token in `localStorage`.
- Provides `login` and `logout` functions.
- Tracks current user authentication status.

#### src/components/Navbar.js
- Navigation bar displayed on all pages.
- Shows app title.
- Displays Login/Register links if not authenticated.
- Displays Logout button if authenticated.

#### src/pages/
- Contains page components.

##### Dashboard.js
- Main logged-in user interface.
- Fetches and displays tasks from backend API.
- Includes `TaskForm` to add new tasks.
- Includes `TaskList` to display existing tasks.
- Provides logout button.

##### Login.js and Register.js
- Forms for user authentication and registration.

#### src/components/TaskForm.js and TaskList.js
- Components for adding new tasks and listing tasks respectively.

#### src/api.js
- Axios instance configured to communicate with backend API.
- Includes JWT token in request headers for authenticated requests.

---

## Installation and Running the Frontend

1. Navigate to the frontend directory:

```bash
cd MERN_TASKMANAGER/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. The app will open in your default browser at `http://localhost:3000`.

---

## Authentication Flow

- Users register or login to receive a JWT token.
- The token is stored in `localStorage` and managed by `AuthContext`.
- Authenticated routes (like Dashboard) require a valid token.
- The token is sent in the `Authorization` header for API requests to the backend.

---

## Dependencies

- React and React DOM for building UI.
- React Router DOM for client-side routing.
- Axios for HTTP requests.
- Bootstrap for styling.
- date-fns for date utilities.
- Testing libraries for unit and integration tests.

---

This README provides comprehensive documentation of the frontend modules and instructions to run the frontend application.
