import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/login';
import Home from './pages/dashboard/Home';
import Expense from './pages/dashboard/Expense';
import Income from './pages/dashboard/Income';
import { Navigate } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/signup' exact element={<SignUp />} />
          <Route path='/dashboard' exact element={<Home />} />
          <Route path='/expense' exact element={<Expense />} />
          <Route path='/income' exact element={<Income />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;

const Root = () => {
  // check if the token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");
  // redirect the dashboard if authenticated else redirect to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
}