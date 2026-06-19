import type { PeriodAnalysis } from '../../services/plannerService'
import type { PlannedPeriod } from '../../types/user.types'
import { Badge } from '../../components/ui'
import styles from './PlannedView.module.css'

interface PlannedViewProps {
  analyses: PeriodAnalysis[]
  availableDays: number
  totalUsed: number
  onRemovePeriod: (id: string) => void
  onOpenPlanner: () => void
}

function formatFull(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
    weekday: 'short', day: 'numeric', month: 'long'
  })
}

function formatShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short'
  })
}

export function PlannedView({
  analyses,
  availableDays,
  totalUsed,
  onRemovePeriod,
  onOpenPlanner,
}: PlannedViewProps) {
  const remaining = availableDays - totalUsed

  return (
    <div className={styles.container}>
      {/* Resumen general */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryNum}>{availableDays}</span>
          <span className={styles.summaryLabel}>días disponibles</span>
        </div>
        <div className={styles.summaryArrow}>→</div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryNum}>{totalUsed}</span>
          <span className={styles.summaryLabel}>días planificados</span>
        </div>
        <div className={styles.summaryArrow}>=</div>
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryNum} ${remaining < 0 ? styles.negative : remaining === 0 ? styles.zero : styles.positive}`}>
            {remaining}
          </span>
          <span className={styles.summaryLabel}>días restantes</span>
        </div>
      </div>

      {/* Análisis de cada período */}
      <div className={styles.periodList}>
        {analyses.map(analysis => (
          <div key={analysis.period.id} className={styles.periodCard}>
            {/* Header del período */}
            <div className={styles.periodHeader}>
              <div className={styles.periodDates}>
                <span className={styles.periodRange}>
                  {formatShort(analysis.period.startDate)} → {formatShort(analysis.period.endDate)}
                </span>
                <span className={styles.periodDetail}>
                  {formatFull(analysis.period.startDate)}
                </span>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => onRemovePeriod(analysis.period.id)}
                aria-label="Eliminar período"
              >
                ✕
              </button>
            </div>

            {/* Stats del período — ahora con info legal correcta */}
<div className={styles.periodStats}>
  <div className={styles.stat}>
    <span className={styles.statNum}>{analysis.totalDays}</span>
    <span className={styles.statLabel}>días corridos</span>
  </div>
  <div className={styles.statDivider} />
  <div className={styles.stat}>
    <span className={styles.statNum}>{analysis.workdaysUsed}</span>
    <span className={styles.statLabel}>días hábiles</span>
  </div>
  <div className={styles.statDivider} />
  <div className={styles.stat}>
    <span className={styles.statNum}>{analysis.holidaysInside.length}</span>
    <span className={styles.statLabel}>feriados incluidos</span>
  </div>
</div>

{/* Nota legal */}
<p className={styles.legalNote}>
  📋 Se descuentan {analysis.workdaysUsed} días hábiles de tus vacaciones
  {analysis.holidaysInside.length > 0 && (
    <> — los {analysis.holidaysInside.length} feriado{analysis.holidaysInside.length > 1 ? 's' : ''} incluido{analysis.holidaysInside.length > 1 ? 's' : ''} no se descuentan por ley</>
  )}
</p>

            {/* Feriados incluidos */}
            {analysis.holidaysInside.length > 0 && (
              <div className={styles.holidays}>
                {analysis.holidaysInside.map(h => (
                  <div key={h.id} className={styles.holidayChip}>
  <span>🗓️</span>
  <div className={styles.holidayInfo}>
    <span className={styles.holidayName}>{h.name}</span>
    <span className={styles.holidayDate}>{formatFull(h.date)}</span>
  </div>
  {h.irrenunciable && (
    <span className={styles.irrenunciable}>Irrenunciable</span>
  )}
</div>
                ))}
              </div>
            )}

            {/* Sugerencias de optimización */}
            {analysis.suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className={styles.suggestion}>
                    <span className={styles.suggestionIcon}>💡</span>
                    <div className={styles.suggestionBody}>
                      <p className={styles.suggestionText}>{s.description}</p>
                      <p className={styles.suggestionSaving}>
                        Ahorras {s.workdaysSaved} día{s.workdaysSaved > 1 ? 's' : ''} hábil{s.workdaysSaved > 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón agregar período */}
      <button className={styles.addBtn} onClick={onOpenPlanner}>
        <span className={styles.addIcon}>+</span>
        Agregar otro período de vacaciones
      </button>
    </div>
  )
}