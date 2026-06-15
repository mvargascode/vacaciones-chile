import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { useRecommendations } from '../../hooks/useRecommendations'
import { Header, Tabs, EmptyState, Button } from '../../components/ui'
import { RecommendationCard } from '../../components/recommendation'
import type { RecommendationTier } from '../../types/recommendation.types'
import type { VacationWindow } from '../../types/recommendation.types'
import styles from './DashboardScreen.module.css'

interface DashboardScreenProps {
  onSelectRecommendation: (r: VacationWindow) => void
}

type FilterTab = 'todas' | RecommendationTier

export function DashboardScreen({ onSelectRecommendation }: DashboardScreenProps) {
  const { preferences, resetConfiguration } = useUserPreferences()
  const { region, availableDays, year } = preferences
  const recommendations = useRecommendations(year, region, availableDays)

// Guard: si availableDays es 0, no tiene sentido mostrar nada
if (availableDays === 0) {
  return (
    <div className="app-container">
      <Header title="Vacaciones Chile" />
      <EmptyState
        emoji="😅"
        title="Sin días disponibles"
        description="Configura cuántos días de vacaciones tienes para ver recomendaciones."
      />
      <div style={{ padding: 'var(--space-4)' }}>
        <Button fullWidth onClick={resetConfiguration}>
          Configurar días
        </Button>
      </div>
    </div>
  )
}
  const [activeTab, setActiveTab] = useState<FilterTab>('todas')
  const [showSettings, setShowSettings] = useState(false)

  // Conteo por tier para los badges de los tabs
  const counts = {
    oro:    recommendations.filter(r => r.tier === 'oro').length,
    plata:  recommendations.filter(r => r.tier === 'plata').length,
    bronce: recommendations.filter(r => r.tier === 'bronce').length,
  }

  const tabs = [
    { value: 'todas'  as FilterTab, label: 'Todas',  count: recommendations.length },
    { value: 'oro'    as FilterTab, label: '🥇 Oro',  count: counts.oro },
    { value: 'plata'  as FilterTab, label: '🥈 Plata', count: counts.plata },
    { value: 'bronce' as FilterTab, label: '🥉 Bronce', count: counts.bronce },
  ]

  const filtered = activeTab === 'todas'
    ? recommendations
    : recommendations.filter(r => r.tier === activeTab)

  const emptyMessages: Record<FilterTab, { title: string; description: string }> = {
    todas:  { title: 'Sin oportunidades',       description: 'No encontramos oportunidades para tu configuración actual.' },
    oro:    { title: 'Sin oportunidades oro',    description: 'No hay feriados que permitan una eficiencia 3x o más este año.' },
    plata:  { title: 'Sin oportunidades plata',  description: 'No hay oportunidades de eficiencia 2x para tu configuración.' },
    bronce: { title: 'Sin oportunidades bronce', description: 'Todas las oportunidades disponibles son de mayor eficiencia.' },
  }

  

  return (
    <div className="app-container animate-fade-in">
      <Header
        title="Vacaciones Chile"
        subtitle={`${region} · ${availableDays} días · ${year}`}
        onSettingsClick={() => setShowSettings(prev => !prev)}
      />

      {/* Panel de configuración rápida */}
      {showSettings && (
        <div className={styles.settingsPanel}>
          <p className={styles.settingsText}>
            ¿Quieres cambiar tu región, días disponibles o año?
          </p>
          <div className={styles.settingsActions}>
            <Button
  variant="primary"
  size="sm"
  onClick={() => {
    resetConfiguration()
    setShowSettings(false)
  }}
>
  Reconfigurar
</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <main className={styles.main}>
  <div key={activeTab} className={styles.listWrapper}>
    {filtered.length === 0 ? (
      <EmptyState
        emoji="🗓️"
        title={emptyMessages[activeTab].title}
        description={emptyMessages[activeTab].description}
      />
    ) : (
      <>
        <p className={styles.count}>
          {filtered.length} {filtered.length === 1 ? 'oportunidad' : 'oportunidades'}
          {activeTab !== 'todas' ? ` ${activeTab}` : ''} para {year}
        </p>
        <ul className={styles.list}>
          {filtered.map(r => (
            <li key={r.id}>
              <RecommendationCard
                recommendation={r}
                onClick={() => onSelectRecommendation(r)}
              />
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
</main>

    </div>
  )
}