import { useState } from 'react'
import { IconConfetti, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import type { VacationWindow } from '../../types/recommendation.types'
import type { CalendarDay } from '../../types/calendar.types'
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

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const DAY_NAMES_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

type CellType = 'vacacion' | 'feriado' | 'fin_de_semana' | 'ctx'

interface MiniCalCell {
  date: string
  num: number
  type: CellType
}

function MiniCalendar({ days }: { days: CalendarDay[] }) {
  if (days.length === 0) return null

  const dayMap = new Map(days.map(d => [d.date, d]))

  const firstDay = new Date(days[0].date + 'T00:00:00')
  const lastDay = new Date(days[days.length - 1].date + 'T00:00:00')

  // Align to Sunday–Saturday weeks
  const weekStart = new Date(firstDay)
  weekStart.setDate(weekStart.getDate() - firstDay.getDay())

  // Mostrar solo la semana que contiene el inicio (7 días max)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const cells: MiniCalCell[] = []
  const cursor = new Date(weekStart)
  while (cursor <= weekEnd) {
    const dateStr = toDateStr(cursor)
    const periodDay = dayMap.get(dateStr)
    let type: CellType
    if (periodDay) {
      const dt = periodDay.dayType
      type = dt === 'feriado' ? 'feriado' : dt === 'fin_de_semana' ? 'fin_de_semana' : 'vacacion'
    } else {
      type = 'ctx'
    }
    cells.push({ date: dateStr, num: cursor.getDate(), type })
    cursor.setDate(cursor.getDate() + 1)
  }

  const typeClass: Record<CellType, string> = {
    vacacion:     styles.mcVacacion,
    feriado:      styles.mcFeriado,
    fin_de_semana: styles.mcFinSemana,
    ctx:          styles.mcCtx,
  }

  return (
    <div className={styles.miniCal}>
      {DAY_NAMES_SHORT.map(d => (
        <span key={d} className={styles.mcHdr}>{d}</span>
      ))}
      {cells.map(cell => (
        <span key={cell.date} className={`${styles.mcCell} ${typeClass[cell.type]}`}>
          {cell.num}
        </span>
      ))}
    </div>
  )
}

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

      {/* Mini calendario */}
      <MiniCalendar days={r.days} />

      {/* Acordeón expandido */}
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
                    <p className={styles.holidayItemName}>{h.name}</p>
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

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.detailBtn} onClick={() => setExpanded(e => !e)}>
          {expanded
            ? <><IconChevronUp size={15} stroke={2} /> Ocultar desglose</>
            : <><IconChevronDown size={15} stroke={2} /> Ver desglose completo</>
          }
        </button>
        <ShareButton getText={() => buildShareTextOpportunity(r)} compact={true} />
      </div>
    </Card>
  )
}
