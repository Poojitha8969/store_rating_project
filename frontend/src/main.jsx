// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserStores from './pages/UserStores.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import { getUser } from './services/auth.js';

const Protected = ({ children, roles }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const Home = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/update-password" element={<Protected><UpdatePassword /></Protected>} />
      <Route path="/admin" element={<Protected roles={["ADMIN"]}><AdminDashboard /></Protected>} />
      <Route path="/stores" element={<Protected roles={["USER"]}><UserStores /></Protected>} />
      <Route path="/owner" element={<Protected roles={["STORE_OWNER"]}><OwnerDashboard /></Protected>} />
    </Routes>
  </BrowserRouter>
);