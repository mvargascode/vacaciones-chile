import { useState } from 'react'
import type { VacationWindow } from '../../types/recommendation.types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { PeriodCalendar } from '../calendar/PeriodCalendar'
import styles from './RecommendationCard.module.css'
import { ShareButton } from '../ui'
import { buildShareTextOpportunity } from '../../services/shareService'

interface RecommendationCardProps {
  recommendation: VacationWindow
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function RecommendationCard({ recommendation: r }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card accent={r.tier}>
      <div className={styles.header}>
        <Badge variant={r.tier} />
        <span className={styles.efficiency}>
          {r.efficiency}x eficiencia
        </span>
      </div>

      <div className={styles.dates}>
        <span className={styles.dateRange}>
          {formatShortDate(r.startDate)} → {formatShortDate(r.endDate)}
        </span>
      </div>

      <div className={styles.summary}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{r.totalDaysOff}</span>
          <span className={styles.statLabel}>días libres</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNumber}>{r.vacationDaysRequired}</span>
          <span className={styles.statLabel}>días de vacaciones</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNumber}>{r.holidays.length}</span>
          <span className={styles.statLabel}>{r.holidays.length === 1 ? 'feriado' : 'feriados'}</span>
        </div>
      </div>

      <p className={styles.mainHoliday}>
        {r.holidays.map(h => h.name).join(' + ')}
      </p>

      {expanded && (
        <div className={styles.accordion}>
          <PeriodCalendar days={r.days} />

          <div className={styles.accordionSection}>
            <h3 className={styles.accordionTitle}>
              {r.holidays.length === 1 ? 'Feriado incluido' : 'Feriados incluidos'}
            </h3>
            <ul className={styles.holidayList}>
              {r.holidays.map(h => (
                <li key={h.id} className={styles.holidayItem}>
                  <div>
                    <p className={styles.holidayName}>{h.name}</p>
                    <p className={styles.holidayDate}>{formatFullDate(h.date)}</p>
                  </div>
                  {h.irrenunciable && (
                    <span className={styles.irrenunciableBadge}>Irrenunciable</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.accordionSection}>
            <h3 className={styles.accordionTitle}>Desglose</h3>
            <div className={styles.breakdown}>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Días corridos del período</span>
                <span className={styles.breakdownValue}>{r.totalDaysOff}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Feriados que caen dentro</span>
                <span className={styles.breakdownValue}>−{r.holidays.length}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Fines de semana dentro</span>
                <span className={styles.breakdownValue}>
                  −{r.days.filter(d => d.dayType === 'fin_de_semana').length}
                </span>
              </div>
              <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                <span className={styles.breakdownLabel}>Días de vacaciones a pedir</span>
                <span className={styles.breakdownValue}>{r.vacationDaysRequired}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button
          className={styles.toggleBtn}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Ocultar detalle ▲' : 'Ver detalle ▼'}
        </button>
        <ShareButton
          getText={() => buildShareTextOpportunity(r)}
          compact={true}
        />
      </div>
    </Card>
  )
}
