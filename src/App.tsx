import { useUserPreferences } from './hooks/useUserPreferences'
import { useRecommendations } from './hooks/useRecommendations'
import { Header } from './components/ui'
import { RecommendationCard } from './components/recommendation'
import styles from './App.module.css'

function App() {
  const { preferences } = useUserPreferences()
  const { region, availableDays, year } = preferences
  const recommendations = useRecommendations(year, region, availableDays)

  return (
    <div className="app-container">
      <Header
        title="Vacaciones Chile"
        subtitle={`${region} · ${availableDays} días disponibles`}
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