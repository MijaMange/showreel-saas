import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { seedProfilesIfEmpty } from './app/profileStore'
import { ErrorBoundary } from './app/ErrorBoundary'
import './styles/global.css'
import App from './App.tsx'

seedProfilesIfEmpty()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
