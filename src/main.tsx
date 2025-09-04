import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app/routes'
import './index.css'
import './styles/index.css'
import { bootstrapDevAuth } from './lib/auth'

// Optional: enable auto dev-login only when explicitly opted-in
const enableAutoDevLogin = String((import.meta as any).env?.VITE_ENABLE_DEV_LOGIN ?? '').toLowerCase();
if ((import.meta as any).env?.DEV && (enableAutoDevLogin === '1' || enableAutoDevLogin === 'true')) {
  bootstrapDevAuth((import.meta as any).env?.VITE_API_BASE ?? '/api');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
)
