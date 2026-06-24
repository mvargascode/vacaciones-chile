import { IconConfetti } from '@tabler/icons-react'
import type { VacationWindow } from '../../types/recommendation.types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import styles from './RecommendationCard.module.css'
import { ShareButton } from '../ui'
import {
  buildShareTextOpportunity,
  buildGCalUrlOpportunity,
  buildIcsOpportunity,
} from '../../services/shareService'

interface RecommendationCardProps {
  recommendation: VacationWindow
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

function buildSummaryText(r: VacationWindow): string {
  const start = formatShortDate(r.startDate)
  const end = formatShortDate(r.endDate)
  const dates = r.holidays.map(h => formatFullDate(h.date))
  const article = r.holidays.length > 1 ? 'Los' : 'El'
  const verb = r.holidays.length > 1 ? 'son feriados gratis' : 'es feriado gratis'
  const datesStr = dates.length === 1
    ? dates[0]
    : dates.slice(0, -1).join(', ') + ' y ' + dates[dates.length - 1]
  return `Si pides vacaciones del ${start} al ${end}, descansas ${r.totalDaysOff} días seguidos gastando solo ${r.vacationDaysRequired} días de vacaciones. ${article} ${datesStr} ${verb} 🎉`
}

export function RecommendationCard({ recommendation: r }: RecommendationCardProps) {
  return (
    <Card accent={r.tier}>
      {/* Tier + eficiencia */}
      <div className={styles.header}>
        <Badge variant={r.tier} />
        <span className={styles.efficiency}>{r.efficiency}x eficiencia</span>
      </div>

      {/* Fecha */}
      <div className={styles.dateRow}>
        <span className={styles.dateRange}>
          {formatShortDate(r.startDate)} → {formatShortDate(r.endDate)}
        </span>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={`${styles.statNum} ${styles.statBlue}`}>{r.totalDaysOff}</span>
          <span className={styles.statLabel}>días libres</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{r.vacationDaysRequired}</span>
          <span className={styles.statLabel}>días vacaciones</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={`${styles.statNum} ${styles.statGreen}`}>{r.holidays.length}</span>
          <span className={styles.statLabel}>{r.holidays.length === 1 ? 'feriado' : 'feriados'}</span>
        </div>
      </div>

      {/* Nombre del feriado */}
      <div className={styles.holidayPreview}>
        <IconConfetti size={15} stroke={1.5} className={styles.confettiIcon} />
        <span className={styles.holidayName}>{r.holidays.map(h => h.name).join(' + ')}</span>
      </div>

      {/* Resumen + compartir */}
      <div className={styles.accordion}>
        <p className={styles.summaryText}>{buildSummaryText(r)}</p>
        <ShareButton
          getText={() => buildShareTextOpportunity(r)}
          gcalUrl={buildGCalUrlOpportunity(r)}
          getIcs={() => buildIcsOpportunity(r)}
        />
      </div>
    </Card>
  )
}
