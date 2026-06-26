import { lazy, Suspense } from 'react'
import { useTheme } from './hooks/useTheme'
import { useUserPreferences } from './hooks/useUserPreferences'
import { IOSInstallBanner } from './components/ui'

const OnboardingScreen = lazy(() =>
  import('./features/onboarding/OnboardingScreen').then(m => ({ default: m.OnboardingScreen }))
)
const DashboardScreen = lazy(() =>
  import('./features/dashboard/DashboardScreen').then(m => ({ default: m.DashboardScreen }))
)

function App() {
  useTheme()
  const { isConfigured } = useUserPreferences()

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <Suspense fallback={null}>
        {!isConfigured ? <OnboardingScreen /> : <DashboardScreen />}
      </Suspense>
      <IOSInstallBanner />
    </>
  )
}

export default App
