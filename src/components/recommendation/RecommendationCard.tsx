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

export function RecommendationCard({ recommendation: r }: RecommendationCardProps) {
  const efficiencyText = Number.isFinite(r.efficiency)
    ? `${r.efficiency}x eficiencia`
    : 'Gratis 🎉'

  const parts: string[] = [
    `📅 ${r.totalDaysOff} libre${r.totalDaysOff !== 1 ? 's' : ''}`,
  ]
  if (r.vacationDaysRequired > 0) {
    parts.push(`🧳 ${r.vacationDaysRequired} vacación${r.vacationDaysRequired !== 1 ? 'es' : ''}`)
  }
  if (r.holidays.length > 0) {
    parts.push(r.holidays.map(h => h.name).join(' + '))
  }

  return (
    <Card accent={r.tier}>
      <div className={styles.topRow}>
        <div className={styles.topLeft}>
          <Badge variant={r.tier} />
          <span className={styles.dateRange}>
            {formatShortDate(r.startDate)} → {formatShortDate(r.endDate)}
          </span>
        </div>
        <span className={styles.efficiency}>{efficiencyText}</span>
      </div>

      <div className={styles.bottomRow}>
        <span className={styles.statsLine}>{parts.join(' · ')}</span>
        <ShareButton
          getText={() => buildShareTextOpportunity(r)}
          gcalUrl={buildGCalUrlOpportunity(r)}
          getIcs={() => buildIcsOpportunity(r)}
        />
      </div>
    </Card>
  )
}
