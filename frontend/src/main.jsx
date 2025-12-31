import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/dashboard.jsx'


console.log('main loaded — Dashboard is root')

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
} catch (err) {
  console.error('Render error', err)
  const root = document.getElementById('root')
  if (root) root.textContent = 'Render error: ' + err.message
}
