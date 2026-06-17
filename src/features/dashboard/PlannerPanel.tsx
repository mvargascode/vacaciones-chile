import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { usePlanner } from '../../hooks/usePlanner'
import { PeriodPicker } from '../onboarding/PeriodPicker'
import type { CalendarDay } from '../../types/calendar.types'
import styles from './PlannerPanel.module.css'

interface PlannerPanelProps {
  calendarDays: CalendarDay[]
}

export function PlannerPanel({ calendarDays }: PlannerPanelProps) {
  const { preferences, addPlannedPeriod, removePlannedPeriod } = useUserPreferences()
  const { plannedPeriods, availableDays } = preferences
  const [expanded, setExpanded] = useState(plannedPeriods.length > 0)

  const { analyses, totalUsed, remaining } = usePlanner(
    plannedPeriods,
    calendarDays,
    availableDays
  )

  return (
    <div className={styles.panel}>
      <button
        className={styles.toggle}
        onClick={() => setExpanded(prev => !prev)}
      >
        <span className={styles.toggleTitle}>
          📅 Mi planificación
          {plannedPeriods.length > 0 && (
            <span className={styles.badge}>{plannedPeriods.length}</span>
          )}
        </span>
        <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className={styles.content}>
          {/* Resumen de días */}
          {plannedPeriods.length > 0 && (
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryNum}>{totalUsed}</span>
                <span className={styles.summaryLabel}>usados</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryItem}>
                <span className={`${styles.summaryNum} ${remaining < 0 ? styles.negative : ''}`}>
                  {remaining}
                </span>
                <span className={styles.summaryLabel}>restantes</span>
              </div>
            </div>
          )}

          {/* Análisis de períodos existentes */}
          {analyses.map(analysis => (
            <div key={analysis.period.id} className={styles.analysisCard}>
              <div className={styles.analysisHeader}>
                <span className={styles.analysisDates}>
                  {formatShort(analysis.period.startDate)} → {formatShort(analysis.period.endDate)}
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removePlannedPeriod(analysis.period.id)}
                  aria-label="Eliminar"
                >
                  ×
                </button>
              </div>

              <div className={styles.analysisStats}>
                <span>{analysis.workdaysUsed} días hábiles</span>
                {analysis.holidaysInside.length > 0 && (
                  <span className={styles.holidayBadge}>
                    🗓️ {analysis.holidaysInside.length} feriado{analysis.holidaysInside.length > 1 ? 's' : ''} incluido{analysis.holidaysInside.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Sugerencias de optimización */}
              {analysis.suggestions.map((s, i) => (
                <div key={i} className={styles.suggestion}>
                  <span className={styles.suggestionIcon}>💡</span>
                  <span className={styles.suggestionText}>{s.description}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Selector de nuevo período */}
          <div className={styles.pickerSection}>
            <p className={styles.pickerTitle}>
              {plannedPeriods.length === 0
                ? 'Toca un día para agregar vacaciones'
                : 'Agregar otro período'}
            </p>
            <PeriodPicker
              calendarDays={calendarDays}
              periods={plannedPeriods}
              onAddPeriod={addPlannedPeriod}
              onRemovePeriod={removePlannedPeriod}
              availableDays={availableDays}
              usedDays={totalUsed}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function formatShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}