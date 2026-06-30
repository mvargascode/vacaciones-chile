import { Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useUserPreferences } from './hooks/useUserPreferences'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import { AcercaDe } from './features/pages/AcercaDe'
import { Contacto } from './features/pages/Contacto'
import { IOSInstallBanner } from './components/ui'

function App() {
  useTheme()
  const { isConfigured } = useUserPreferences()

  return (
    <Routes>
      <Route path="/acerca-de" element={<AcercaDe />} />
      <Route path="/contacto"  element={<Contacto />} />
      <Route path="*" element={
        <>
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
          {!isConfigured ? <OnboardingScreen /> : <DashboardScreen />}
          <IOSInstallBanner />
        </>
      } />
    </Routes>
  )
}

export default App
