import { useState } from 'react'
import { IconConfetti, IconChevronDown, IconChevronUp, IconSquare, IconCalendarPlus } from '@tabler/icons-react'
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

function buildGCalUrl(r: VacationWindow): string {
  const startFmt = r.startDate.replace(/-/g, '')
  const d = new Date(r.endDate + 'T00:00:00')
  d.setDate(d.getDate() + 1)
  const endFmt = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const title = encodeURIComponent(`Vacaciones (${r.holidays.map(h => h.name).join(' + ')})`)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFmt}/${endFmt}`
}

const CHECKLIST = [
  'Avisar a tu jefe o equipo',
  'Bloquear el período en tu calendario',
  'Coordinar con familia o compañeros de viaje',
]

export function RecommendationCard({ recommendation: r }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)

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

      {/* Detalle expandido */}
      {expanded && (
        <div className={styles.accordion}>
          {/* Resumen en texto natural */}
          <p className={styles.summaryText}>{buildSummaryText(r)}</p>

          {/* Calendario */}
          <PeriodCalendar days={r.days} />

          {/* Checklist de acción */}
          <div className={styles.checklist}>
            {CHECKLIST.map(item => (
              <div key={item} className={styles.checkItem}>
                <IconSquare size={16} stroke={1.5} className={styles.checkIcon} />
                <span>{item}</span>
              </div>
            ))}
            <a
              href={buildGCalUrl(r)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.gcalBtn}
            >
              <IconCalendarPlus size={16} stroke={1.5} />
              Exportar a Google Calendar
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.detailBtn} onClick={() => setExpanded(e => !e)}>
          {expanded
            ? <><IconChevronUp size={15} stroke={2} /> Ocultar detalle</>
            : <><IconChevronDown size={15} stroke={2} /> Ver detalle</>
          }
        </button>
        <ShareButton getText={() => buildShareTextOpportunity(r)} compact={true} />
      </div>
    </Card>
  )
}
