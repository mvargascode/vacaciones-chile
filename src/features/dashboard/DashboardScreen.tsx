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
import type { RecommendationTier } from '../../types/recommendation.types'
import styles from './DashboardScreen.module.css'

type FilterTab = 'todas' | RecommendationTier

export function DashboardScreen() {
  const {
    preferences,
    resetConfiguration,
    addPlannedPeriod,
    removePlannedPeriod,
    updatePlannedPeriod,
  } = useUserPreferences()

  const { region, totalAvailableDays, daysToUse, year, plannedPeriods } = preferences

  const { holidays, loading, fromApi } = useHolidaysApi(year, region)

  const allRecommendations = useRecommendations(year, holidays, totalAvailableDays)

  // Solo mostrar oportunidades del mes actual en adelante
  const recommendations = useMemo(() => {
    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .slice(0, 10)
    return allRecommendations.filter(r => r.startDate >= monthStart)
  }, [allRecommendations])

  const calendarDays = useMemo(
    () => buildYearCalendar(year, holidays),
    [year, holidays]
  )

  const { analyses, totalUsed } = usePlanner(
    plannedPeriods,
    calendarDays,
    daysToUse,
    preferences.sector
  )

  const [activeTab,    setActiveTab]   = useState<FilterTab>('todas')
  const [drawerOpen,   setDrawerOpen]  = useState(false)
  const [filterByDays, setFilterByDays] = useState(false)

  const hasPlannedPeriods = plannedPeriods.length > 0

  const filteredByDays = filterByDays
    ? recommendations.filter(r => r.vacationDaysRequired <= daysToUse)
    : recommendations

  const counts = {
    todas:  filteredByDays.length,
    oro:    filteredByDays.filter(r => r.tier === 'oro').length,
    plata:  filteredByDays.filter(r => r.tier === 'plata').length,
    bronce: filteredByDays.filter(r => r.tier === 'bronce').length,
  }

  const tabs = [
    { value: 'todas'  as FilterTab, label: 'Todas',     count: counts.todas },
    { value: 'oro'    as FilterTab, label: '🥇 Oro',    count: counts.oro },
    { value: 'plata'  as FilterTab, label: '🥈 Plata',  count: counts.plata },
    { value: 'bronce' as FilterTab, label: '🥉 Bronce', count: counts.bronce },
  ]

  const filtered = activeTab === 'todas'
    ? filteredByDays
    : filteredByDays.filter(r => r.tier === activeTab)

  const emptyMessages: Record<FilterTab, { title: string; description: string }> = {
    todas:  { title: 'Sin oportunidades',       description: 'No encontramos oportunidades para tu configuración.' },
    oro:    { title: 'Sin oportunidades oro',    description: 'No hay feriados que permitan eficiencia 3x o más.' },
    plata:  { title: 'Sin oportunidades plata',  description: 'No hay oportunidades de eficiencia 2x.' },
    bronce: { title: 'Sin oportunidades bronce', description: 'Todas las oportunidades son de mayor eficiencia.' },
  }

  function handleApplySuggestion(periodId: string, newStart: string, newEnd: string) {
    updatePlannedPeriod(periodId, newStart, newEnd)
  }

  return (
    <div className="app-container animate-fade-in">
      <Header
        title="Vacaciones Chile"
        subtitle={`${region} · ${daysToUse} de ${totalAvailableDays} días`}
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
              totalAvailableDays={totalAvailableDays}
              daysToUse={daysToUse}
              year={year}
              sector={preferences.sector}
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

              {/* Toggle ver todas / ver con mis días */}
              <div className={styles.toggleWrapper}>
                <button
                  className={`${styles.toggleBtn} ${!filterByDays ? styles.toggleActive : ''}`}
                  onClick={() => setFilterByDays(false)}
                >
                  Ver todas
                </button>
                <button
                  className={`${styles.toggleBtn} ${filterByDays ? styles.toggleActive : ''}`}
                  onClick={() => setFilterByDays(true)}
                >
                  Con mis {daysToUse} días
                </button>
              </div>

              <div key={activeTab} className={styles.listWrapper}>
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
                          <RecommendationCard recommendation={r} />
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
                availableDays={daysToUse}
                totalUsed={totalUsed}
                sector={preferences.sector}
                onRemovePeriod={removePlannedPeriod}
                onApplySuggestion={handleApplySuggestion}
                onOpenPlanner={() => setDrawerOpen(true)}
              />

              <details className={styles.extraOpportunities}>
                <summary className={styles.extraSummary}>
                  Ver otras oportunidades del año ({recommendations.length})
                </summary>
                <ul className={styles.list} style={{ marginTop: 'var(--space-4)' }}>
                  {recommendations.map(r => (
                    <li key={r.id}>
                      <RecommendationCard recommendation={r} />
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
          availableDays={daysToUse}
          usedDays={totalUsed}
          sector={preferences.sector}
        />
      </Drawer>
    </div>
  )
}
