import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Landing       from './pages/Landing';
import Login         from './pages/Login';
import Register      from './pages/Register';
import VerifyEmail   from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard     from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                element={<Landing />} />
          <Route path="/home"            element={<Landing />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/verify-email"    element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#131d35',
            color: '#f0f4ff',
            border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#131d35' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#131d35' } },
        }}
      />
    </AuthProvider>
  );
}
