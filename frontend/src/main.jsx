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


console.log('main loaded — Dashboard is root')
;(async () => {
  try {
    const mod = await import('./components/UserLogin.jsx')
    console.log('DEBUG: UserLogin module exports ->', mod)
  } catch (e) {
    console.error('DEBUG: UserLogin import failed', e)
  }
})()

;(async () => {
  try {
    const mod = await import('./components/AdminDashboard.jsx')
    console.log('DEBUG: AdminDashboard module exports ->', mod)
  } catch (e) {
    console.error('DEBUG: AdminDashboard import failed', e)
  }
})()

;(async () => {
  try {
    const mod = await import('./components/UserDashboard.jsx')
    console.log('DEBUG: UserDashboard module exports ->', mod)
  } catch (e) {
    console.error('DEBUG: UserDashboard import failed', e)
  }
})()

;(async () => {
  try {
    const mod = await import('./components/ValidatorDashboard.jsx')
    console.log('DEBUG: ValidatorDashboard module exports ->', mod)
  } catch (e) {
    console.error('DEBUG: ValidatorDashboard import failed', e)
  }
})()

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <div style={{background: 'yellow', color: '#000', padding: '8px', textAlign: 'center'}}>DEV: React mounted — debug banner</div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/validator" element={<ValidatorLogin />} />
          <Route path="/validator/dashboard" element={<ValidatorDashboard />} />

        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
} catch (err) {
  console.error('Render error', err)
  const root = document.getElementById('root')
  if (root) root.textContent = 'Render error: ' + err.message
}
