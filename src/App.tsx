import { useState } from 'react'
import { useUserPreferences } from './hooks/useUserPreferences'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import { DetailScreen } from './features/detail/DetailScreen'
import type { VacationWindow } from './types/recommendation.types'

function App() {
  const { isConfigured } = useUserPreferences()
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<VacationWindow | null>(null)

  // Onboarding: sin app-container, ocupa toda la pantalla
  if (!isConfigured) return <OnboardingScreen />

  if (selectedRecommendation) {
    return (
      <div className="app-container">
        <DetailScreen
          recommendation={selectedRecommendation}
          onBack={() => setSelectedRecommendation(null)}
        />
      </div>
    )
  }

  return (
    <div className="app-container">
      <DashboardScreen onSelectRecommendation={setSelectedRecommendation} />
    </div>
  )
}

export default App