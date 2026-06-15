import type { VacationWindow } from '../../types/recommendation.types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import styles from './RecommendationCard.module.css'

interface RecommendationCardProps {
  recommendation: VacationWindow
  onClick?: () => void
}

// "2025-09-13" → "13 sep"
function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

export function RecommendationCard({ recommendation: r, onClick }: RecommendationCardProps) {
  return (
    <Card accent={r.tier} onClick={onClick}>
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

      {onClick && (
        <p className={styles.cta}>Ver detalle →</p>
      )}
    </Card>
  )
}