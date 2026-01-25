import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

import { PropertyProvider } from './context/PropertyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PropertyProvider>
        <App />
      </PropertyProvider>
    </AuthProvider>
  </StrictMode>,
)
