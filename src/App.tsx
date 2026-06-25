import { useTheme } from './hooks/useTheme'
import { useUserPreferences } from './hooks/useUserPreferences'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import { IOSInstallBanner } from './components/ui'

function App() {
  useTheme()
  const { isConfigured } = useUserPreferences()

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      {!isConfigured ? <OnboardingScreen /> : <DashboardScreen />}
      <IOSInstallBanner />
    </>
  )
}

export default App
