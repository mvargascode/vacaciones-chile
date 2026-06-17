import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { Header, Tabs, EmptyState, Sidebar, SidebarSection } from '../../components/ui'
import { RecommendationCard } from '../../components/recommendation'
import { SidebarFilter } from './SidebarFilter'
import { SidebarInfo } from './SidebarInfo'
import { useHolidaysApi } from '../../hooks/useHolidaysApi'
import { useRecommendations } from '../../hooks/useRecommendations'
import type { RecommendationTier, VacationWindow } from '../../types/recommendation.types'
import styles from './DashboardScreen.module.css'

type FilterTab = 'todas' | RecommendationTier

interface DashboardScreenProps {
  onSelectRecommendation: (r: VacationWindow) => void
}

export function DashboardScreen({ onSelectRecommendation }: DashboardScreenProps) {
  const { preferences, resetConfiguration } = useUserPreferences()
  const { region, availableDays, year } = preferences
  const { holidays, loading, fromApi } = useHolidaysApi(year, region)
  const recommendations = useRecommendations(year, holidays, availableDays)
  const [activeTab, setActiveTab] = useState<FilterTab>('todas')

  const counts = {
    todas:  recommendations.length,
    oro:    recommendations.filter(r => r.tier === 'oro').length,
    plata:  recommendations.filter(r => r.tier === 'plata').length,
    bronce: recommendations.filter(r => r.tier === 'bronce').length,
  }

  const tabs = [
    { value: 'todas'  as FilterTab, label: 'Todas',    count: counts.todas },
    { value: 'oro'    as FilterTab, label: '🥇 Oro',   count: counts.oro },
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
        // Opción: mostrarlo más discreto
        subtitle={`${region} · ${availableDays} días disponibles`}
        onSettingsClick={resetConfiguration}
      />

      <div className={styles.layout}>
        {/* Sidebar — solo visible en desktop */}
        <Sidebar>
          <SidebarSection title="Filtrar por tier">
            <SidebarFilter
              active={activeTab}
              onChange={setActiveTab}
              counts={counts}
            />
          </SidebarSection>
          <SidebarSection title="Tu configuración">
            <SidebarInfo
  region={region}
  availableDays={availableDays}
  year={year}
  totalRecommendations={recommendations.length}
  onReset={resetConfiguration}
  fromApi={fromApi}   // ← nuevo
/>

          </SidebarSection>
        </Sidebar>

        {/* Contenido principal */}
        <div className={styles.main}>
          {/* Tabs — solo visible en mobile */}
          <div className={styles.tabsWrapper}>
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>

          {loading && (
  <div style={{
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    borderBottom: '1px solid var(--color-border)',
  }}>
    Cargando feriados...
  </div>
)}

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
        </div>
      </div>
    </div>
  )
}