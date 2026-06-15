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

  if (!isConfigured) return <OnboardingScreen />

  if (selectedRecommendation) {
    return (
      <DetailScreen
        recommendation={selectedRecommendation}
        onBack={() => setSelectedRecommendation(null)}
      />
    )
  }

  return (
    <DashboardScreen
      onSelectRecommendation={setSelectedRecommendation}
    />
  )
}

export default App