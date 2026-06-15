import { useUserPreferences } from './hooks/useUserPreferences'
import { useRecommendations } from './hooks/useRecommendations'
import { Header } from './components/ui'
import { RecommendationCard } from './components/recommendation'
import { OnboardingScreen } from './features/onboarding/OnboardingScreen'
import styles from './App.module.css'

function App() {
  const { preferences, isConfigured } = useUserPreferences()
  const { region, availableDays, year } = preferences
  const recommendations = useRecommendations(year, region, availableDays)

  // Si el usuario nunca configuró sus preferencias, mostramos onboarding
  if (!isConfigured) {
    return <OnboardingScreen />
  }

  return (
    <div className="app-container">
      <Header
        title="Vacaciones Chile"
        subtitle={`${region} · ${availableDays} días disponibles · ${year}`}
      />
      <main className={styles.main}>
        <p className={styles.count}>
          {recommendations.length} oportunidades para {year}
        </p>
        <ul className={styles.list}>
          {recommendations.map(r => (
            <li key={r.id}>
              <RecommendationCard
                recommendation={r}
                onClick={() => console.log('Ver detalle:', r.id)}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App