import type { CalendarDay } from '../../types/calendar.types'
import styles from './PeriodCalendar.module.css'

interface PeriodCalendarProps {
  days: CalendarDay[]
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function getMonthLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
}

function getDayNumber(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDate()
}

function getMonth(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getMonth()
}

// Agrupa los días por mes para renderizar un mini-calendario por mes
function groupByMonth(days: CalendarDay[]): CalendarDay[][] {
  const groups: CalendarDay[][] = []
  let current: CalendarDay[] = []
  let currentMonth = -1

  for (const day of days) {
    const month = getMonth(day.date)
    if (month !== currentMonth) {
      if (current.length > 0) groups.push(current)
      current = [day]
      currentMonth = month
    } else {
      current.push(day)
    }
  }
  if (current.length > 0) groups.push(current)
  return groups
}

export function PeriodCalendar({ days }: PeriodCalendarProps) {
  if (days.length === 0) return null

  const monthGroups = groupByMonth(days)

  return (
    <div className={styles.container}>
      {monthGroups.map((monthDays, groupIndex) => {
        const firstDay = new Date(monthDays[0].date + 'T00:00:00')
        const startOffset = firstDay.getDay()

        return (
          <div key={groupIndex} className={styles.monthBlock}>
            {/* Nombre del mes */}
            <p className={styles.monthLabel}>
              {getMonthLabel(monthDays[0].date)}
            </p>

            <div className={styles.grid}>
              {/* Encabezado días de semana */}
              {DAY_NAMES.map(name => (
                <div key={name} className={styles.dayName}>{name}</div>
              ))}

              {/* Celdas vacías para alinear */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className={styles.empty} />
              ))}

              {/* Días del mes */}
              {monthDays.map(day => (
                <div
                  key={day.date}
                  className={`${styles.day} ${styles[day.dayType]}`}
                  title={day.holiday?.name}
                >
                  <span className={styles.dayNumber}>
                    {getDayNumber(day.date)}
                  </span>
                  {day.holiday && (
                    <span className={styles.holidayDot} />
                  )}
                </div>
              ))}

              {/* Celdas vacías para completar la última semana */}
              {Array.from({
                length: (7 - ((startOffset + monthDays.length) % 7)) % 7,
              }).map((_, i) => (
                <div key={`trailing-${i}`} className={styles.empty} />
              ))}
            </div>
          </div>
        )
      })}

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