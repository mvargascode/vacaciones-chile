import type { PeriodAnalysis } from '../../services/plannerService'
import styles from './PlannedView.module.css'

interface PlannedViewProps {
  analyses: PeriodAnalysis[]
  availableDays: number
  totalUsed: number
  sector: 'privado' | 'publico'
  onRemovePeriod: (id: string) => void
  onApplySuggestion: (periodId: string, newStart: string, newEnd: string) => void
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
  sector,
  onRemovePeriod,
  onApplySuggestion,
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

      {/* Cards de período */}
      <div className={styles.periodList}>
        {analyses.map(analysis => (
          <div key={analysis.period.id} className={styles.periodCard}>

            {/* Header */}
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

            {/* Mensaje wow */}
            <div className={styles.wowMessage}>
              <span className={styles.wowIcon}>🎉</span>
              <p className={styles.wowText}>
                Usas <strong>{analysis.workdaysUsed} día{analysis.workdaysUsed !== 1 ? 's' : ''} de vacaciones</strong> y descansas <strong>{analysis.totalDays} días en total</strong>
              </p>
            </div>

            {/* Stats */}
            <div className={styles.periodStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{analysis.workdaysUsed}</span>
                <span className={styles.statLabel}>días usados</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={`${styles.statNum} ${styles.statRest}`}>
                  {analysis.totalDays}
                </span>
                <span className={styles.statLabel}>días descansando</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={`${styles.statNum} ${styles.statFree}`}>
                  {analysis.totalDays - analysis.workdaysUsed}
                </span>
                <span className={styles.statLabel}>días gratis</span>
              </div>
            </div>

            {/* Desglose */}
            <div className={styles.breakdown}>
              <span className={styles.breakdownItem}>
                📅 {analysis.workdaysUsed} días hábiles
              </span>
              {analysis.holidaysInside.length > 0 && (
                <span className={styles.breakdownItem}>
                  🎉 +{analysis.holidaysInside.length} feriado{analysis.holidaysInside.length !== 1 ? 's' : ''} gratis
                </span>
              )}
              {analysis.sundaysInside > 0 && (
                <span className={styles.breakdownItem}>
                  😴 +{analysis.sundaysInside} domingo{analysis.sundaysInside !== 1 ? 's' : ''} gratis
                </span>
              )}
              {analysis.saturdaysInside > 0 && sector === 'publico' && (
                <span className={styles.breakdownItem}>
                  😴 +{analysis.saturdaysInside} sábado{analysis.saturdaysInside !== 1 ? 's' : ''} gratis
                </span>
              )}
            </div>

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

            {/* Sugerencias */}
            {analysis.suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className={styles.suggestion}>
                    <span className={styles.suggestionIcon}>💡</span>
                    <div className={styles.suggestionBody}>
                      <p className={styles.suggestionText}>{s.description}</p>
                      <p className={styles.suggestionSaving}>
                        Ahorras {s.workdaysSaved} día{s.workdaysSaved !== 1 ? 's' : ''} hábil{s.workdaysSaved !== 1 ? 'es' : ''}
                      </p>
                    </div>
                    <button
                      className={styles.applyBtn}
                      onClick={() => {
                        const newStart = s.type === 'extend_start'
                          ? s.suggestedDate
                          : analysis.period.startDate
                        const newEnd = s.type === 'extend_end'
                          ? s.suggestedDate
                          : analysis.period.endDate
                        onApplySuggestion(analysis.period.id, newStart, newEnd)
                      }}
                    >
                      Aplicar
                    </button>
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