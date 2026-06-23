import { useUserPreferences } from './hooks/useUserPreferences'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'

function App() {
  const { isConfigured } = useUserPreferences()

  if (!isConfigured) return <OnboardingScreen />

  return (
    <div className="app-container">
      <DashboardScreen />
    </div>
  )
}

export default App
