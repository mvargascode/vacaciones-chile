import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useUserPreferences } from './hooks/useUserPreferences'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import { AcercaDe } from './features/pages/AcercaDe'
import { Contacto } from './features/pages/Contacto'
import { FeriadosChile } from './features/pages/FeriadosChile'
import { ComoFunciona } from './features/pages/ComoFunciona'
import { Links } from './features/pages/Links'
import { IOSInstallBanner } from './components/ui'

function App() {
  useTheme()
  const { isConfigured } = useUserPreferences()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1972306655122291'
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Routes>
      <Route path="/acerca-de" element={<AcercaDe />} />
      <Route path="/contacto"  element={<Contacto />} />
      <Route path="/feriados-chile" element={<FeriadosChile />} />
      <Route path="/como-funciona" element={<ComoFunciona />} />
      <Route path="/links" element={<Links />} />
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
