import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/login';
import Home from './pages/dashboard/Home';
import Expense from './pages/dashboard/Expense';
import Income from './pages/dashboard/Income';
import UserProvider from './context/userContext';
import { ThemeProvider } from './context/themeContext';

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Router>
          <Routes>
            <Route path='/' element={<Root />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/dashboard' element={<Home />} />
            <Route path='/expense' element={<Expense />} />
            <Route path='/income' element={<Income />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
}