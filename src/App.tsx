import { useUserPreferences } from './hooks/useUserPreferences'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'

function App() {
  const { isConfigured } = useUserPreferences()

  return isConfigured
    ? <DashboardScreen />
    : <OnboardingScreen />
}

export default App