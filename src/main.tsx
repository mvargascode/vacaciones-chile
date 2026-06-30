import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/global.css'
import { UserPreferencesProvider } from './context/UserPreferencesContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserPreferencesProvider>
        <App />
      </UserPreferencesProvider>
    </BrowserRouter>
  </StrictMode>,
)