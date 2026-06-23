import type { CalendarDay } from '../../types/calendar.types'
import styles from './PeriodCalendar.module.css'

interface PeriodCalendarProps {
  days: CalendarDay[]
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getMonthLabel(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
}

interface Cell {
  dateStr: string
  num: number
  day: CalendarDay | null
}

function buildWeekRows(days: CalendarDay[]): Cell[][] {
  if (!days.length) return []
  const dayMap = new Map(days.map(d => [d.date, d]))

  const first = new Date(days[0].date + 'T00:00:00')
  const last = new Date(days[days.length - 1].date + 'T00:00:00')

  // Domingo anterior (o igual) al primer día
  const weekStart = new Date(first)
  weekStart.setDate(weekStart.getDate() - first.getDay())

  // Sábado siguiente (o igual) al último día
  const weekEnd = new Date(last)
  weekEnd.setDate(weekEnd.getDate() + (6 - last.getDay()))

  const rows: Cell[][] = []
  const cursor = new Date(weekStart)

  while (cursor <= weekEnd) {
    const row: Cell[] = []
    for (let i = 0; i < 7; i++) {
      const dateStr = toDateStr(cursor)
      row.push({ dateStr, num: cursor.getDate(), day: dayMap.get(dateStr) ?? null })
      cursor.setDate(cursor.getDate() + 1)
    }
    rows.push(row)
  }

  return rows
}

export function PeriodCalendar({ days }: PeriodCalendarProps) {
  if (!days.length) return null

  const rows = buildWeekRows(days)

  const startLabel = getMonthLabel(days[0].date)
  const endLabel = getMonthLabel(days[days.length - 1].date)
  const monthTitle = startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`

  return (
    <div className={styles.container}>
      <p className={styles.monthLabel}>{monthTitle}</p>

      <div className={styles.grid}>
        {DAY_NAMES.map(name => (
          <div key={name} className={styles.dayName}>{name}</div>
        ))}

        {rows.flatMap(row =>
          row.map(cell =>
            cell.day ? (
              <div
                key={cell.dateStr}
                className={`${styles.day} ${styles[cell.day.dayType]}`}
                title={cell.day.holiday?.name}
              >
                <span className={styles.dayNumber}>{cell.num}</span>
                {cell.day.holiday && <span className={styles.holidayDot} />}
              </div>
            ) : (
              <div key={cell.dateStr} className={styles.contextDay}>
                <span className={styles.dayNumber}>{cell.num}</span>
              </div>
            )
          )
        )}
      </div>

      {/* Leyenda */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.feriado}`} />
          <span>Feriado</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.vacacion}`} />
          <span>Vacaciones</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.fin_de_semana}`} />
          <span>Fin de semana</span>
        </div>
      </div>
    </div>
  )
}
