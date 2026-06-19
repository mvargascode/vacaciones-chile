import { useState, useMemo } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { useHolidaysApi } from '../../hooks/useHolidaysApi'
import { useRecommendations } from '../../hooks/useRecommendations'
import { usePlanner } from '../../hooks/usePlanner'
import { buildYearCalendar } from '../../services/calendarService'
import { Header, Tabs, EmptyState, Sidebar, SidebarSection, Drawer } from '../../components/ui'
import { RecommendationCard } from '../../components/recommendation'
import { SidebarFilter } from './SidebarFilter'
import { SidebarInfo } from './SidebarInfo'
import { PlannedView } from './PlannedView'
import { PeriodPicker } from '../onboarding/PeriodPicker'
import type { RecommendationTier, VacationWindow } from '../../types/recommendation.types'
import styles from './DashboardScreen.module.css'

type FilterTab = 'todas' | RecommendationTier

interface DashboardScreenProps {
  onSelectRecommendation: (r: VacationWindow) => void
}

export function DashboardScreen({ onSelectRecommendation }: DashboardScreenProps) {
  const {
    preferences,
    resetConfiguration,
    addPlannedPeriod,
    removePlannedPeriod,
  } = useUserPreferences()
  const { region, availableDays, year, plannedPeriods } = preferences

  const { holidays, loading, fromApi } = useHolidaysApi(year, region)
  const recommendations = useRecommendations(year, holidays, availableDays)

  const calendarDays = useMemo(
    () => buildYearCalendar(year, holidays),
    [year, holidays]
  )

  const { analyses, totalUsed } = usePlanner(
    plannedPeriods,
    calendarDays,
    availableDays,
    preferences.sector
  )

  const [activeTab, setActiveTab]       = useState<FilterTab>('todas')
  const [drawerOpen, setDrawerOpen]     = useState(false)

  const hasPlannedPeriods = plannedPeriods.length > 0

  const counts = {
    todas:  recommendations.length,
    oro:    recommendations.filter(r => r.tier === 'oro').length,
    plata:  recommendations.filter(r => r.tier === 'plata').length,
    bronce: recommendations.filter(r => r.tier === 'bronce').length,
  }

  const tabs = [
    { value: 'todas'  as FilterTab, label: 'Todas',     count: counts.todas },
    { value: 'oro'    as FilterTab, label: '🥇 Oro',    count: counts.oro },
    { value: 'plata'  as FilterTab, label: '🥈 Plata',  count: counts.plata },
    { value: 'bronce' as FilterTab, label: '🥉 Bronce', count: counts.bronce },
  ]

  const filtered = activeTab === 'todas'
    ? recommendations
    : recommendations.filter(r => r.tier === activeTab)

  const emptyMessages: Record<FilterTab, { title: string; description: string }> = {
    todas:  { title: 'Sin oportunidades',       description: 'No encontramos oportunidades para tu configuración.' },
    oro:    { title: 'Sin oportunidades oro',    description: 'No hay feriados que permitan eficiencia 3x o más.' },
    plata:  { title: 'Sin oportunidades plata',  description: 'No hay oportunidades de eficiencia 2x.' },
    bronce: { title: 'Sin oportunidades bronce', description: 'Todas las oportunidades son de mayor eficiencia.' },
  }

  return (
    <div className="app-container animate-fade-in">
      <Header
        title="Vacaciones Chile"
        subtitle={`${region} · ${availableDays} días disponibles`}
        onSettingsClick={resetConfiguration}
      />

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

      <div className={styles.layout}>
        {/* Sidebar — solo desktop */}
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
  sector={preferences.sector}   // ← nuevo
  totalRecommendations={recommendations.length}
  onReset={resetConfiguration}
  fromApi={fromApi}
/>
          </SidebarSection>
        </Sidebar>

        {/* Contenido principal */}
        <div className={styles.main}>

          {/* MODO A — Sin períodos planificados */}
          {!hasPlannedPeriods && (
            <>
              <div className={styles.tabsWrapper}>
                <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
              </div>

              <div key={activeTab} className={styles.listWrapper}>
                {/* CTA para planificar */}
                <button
                  className={styles.plannerCta}
                  onClick={() => setDrawerOpen(true)}
                >
                  <span>📅</span>
                  <span>¿Ya sabes cuándo quieres vacaciones? Planifica aquí →</span>
                </button>

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
            </>
          )}

          {/* MODO B — Con períodos planificados */}
          {hasPlannedPeriods && (
            <div className={styles.listWrapper}>
              <div className={styles.plannedHeader}>
                <h2 className={styles.plannedTitle}>Mis vacaciones planificadas</h2>
                <button
                  className={styles.addPeriodBtn}
                  onClick={() => setDrawerOpen(true)}
                >
                  + Agregar período
                </button>
              </div>

              <PlannedView
  analyses={analyses}
  availableDays={availableDays}
  totalUsed={totalUsed}
  sector={preferences.sector}   // ← nuevo
  onRemovePeriod={removePlannedPeriod}
  onOpenPlanner={() => setDrawerOpen(true)}
/>

              {/* Oportunidades adicionales colapsadas */}
              <details className={styles.extraOpportunities}>
                <summary className={styles.extraSummary}>
                  Ver otras oportunidades del año ({recommendations.length})
                </summary>
                <ul className={styles.list} style={{ marginTop: 'var(--space-4)' }}>
                  {recommendations.map(r => (
                    <li key={r.id}>
                      <RecommendationCard
                        recommendation={r}
                        onClick={() => onSelectRecommendation(r)}
                      />
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Drawer del planificador */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="📅 Planificar vacaciones"
      >
        <PeriodPicker
  calendarDays={calendarDays}
  periods={plannedPeriods}
  onAddPeriod={addPlannedPeriod}
  onRemovePeriod={removePlannedPeriod}
  availableDays={availableDays}
  usedDays={totalUsed}
  sector={preferences.sector}   // ← nuevo
/>
      </Drawer>
    </div>
  )
}