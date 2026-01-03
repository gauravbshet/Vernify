import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/dashboard.jsx'
import AdminLogin from './components/adminlogin.jsx'
import UserLogin from './components/UserLogin.jsx'
import ValidatorLogin from './components/ValidatorLogin.jsx'
import ValidatorDashboard from './components/ValidatorDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import UserDashboard from './components/UserDashboard.jsx'
import NotFound from './components/NotFound.jsx'


console.log('main loaded — Dashboard is root')

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user" element={<Navigate to="/user/login" replace />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/validator" element={<ValidatorLogin />} />
          <Route path="/validator/dashboard" element={<ValidatorDashboard />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
} catch (err) {
  console.error('Render error', err)
  const root = document.getElementById('root')
  if (root) root.textContent = 'Render error: ' + err.message
}
