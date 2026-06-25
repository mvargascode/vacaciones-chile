import { useState } from 'react'
import type { CalendarDay } from '../../types/calendar.types'
import type { PlannedPeriod } from '../../types/user.types'
import styles from './PeriodPicker.module.css'
import { isVacationHabil } from '../../services/calendarService'

interface PeriodPickerProps {
  calendarDays: CalendarDay[]
  periods: PlannedPeriod[]
  onAddPeriod: (period: PlannedPeriod) => void
  onRemovePeriod: (id: string) => void
  availableDays: number
  usedDays: number
  sector: 'privado' | 'publico'   // ← nuevo
}

const todayStr = new Date().toISOString().split('T')[0]

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]
const DAY_NAMES = ['L','M','M','J','V','S','D']

function groupByMonth(days: CalendarDay[]): CalendarDay[][] {
  const groups: CalendarDay[][] = []
  let current: CalendarDay[] = []
  let currentMonth = -1
  for (const day of days) {
    const month = new Date(day.date + 'T00:00:00').getMonth()
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

function isInPeriod(date: string, periods: PlannedPeriod[]): boolean {
  return periods.some(p => date >= p.startDate && date <= p.endDate)
}

function isPeriodStart(date: string, periods: PlannedPeriod[]): boolean {
  return periods.some(p => p.startDate === date)
}

function isPeriodEnd(date: string, periods: PlannedPeriod[]): boolean {
  return periods.some(p => p.endDate === date)
}

export function PeriodPicker({
  calendarDays,
  periods,
  onAddPeriod,
  onRemovePeriod,
  availableDays,
  usedDays,
  sector,   // ← nuevo
}: PeriodPickerProps) {
  const [selecting, setSelecting] = useState<string | null>(null)
  const [hoverDate, setHoverDate] = useState<string | null>(null)

  const today = new Date()
const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString().split('T')[0]
const futureDays = calendarDays.filter(d => d.date >= currentMonthStart)
const monthGroups = groupByMonth(futureDays)

function handleDayClick(date: string, dayType: string) {
  if (dayType === 'fin_de_semana' || dayType === 'feriado') return

  if (!selecting) {
    // Primera fecha: calculamos el fin automático con los días restantes
    const daysRemaining = availableDays - usedDays
    if (daysRemaining > 0) {
      const autoEnd = calculateAutoEnd(date, daysRemaining)
      const id = `${date}_${autoEnd}_${Date.now()}`
      onAddPeriod({ id, startDate: date, endDate: autoEnd })
    } else {
      // Sin días disponibles: igual permitimos selección manual
      setSelecting(date)
    }
  } else {
    // Si estaba en selección manual, completamos con la segunda fecha
    const start = selecting < date ? selecting : date
    const end   = selecting < date ? date : selecting
    const id = `${start}_${end}_${Date.now()}`
    onAddPeriod({ id, startDate: start, endDate: end })
    setSelecting(null)
    setHoverDate(null)
  }
}

function calculateAutoEnd(startDate: string, daysNeeded: number): string {
  const startIdx = calendarDays.findIndex(d => d.date === startDate)
  if (startIdx === -1 || daysNeeded <= 0) return startDate

  let habilCount = 0
  let endIdx = startIdx

  for (let i = startIdx; i < calendarDays.length; i++) {
    if (isVacationHabil(calendarDays[i])) {
      habilCount++
    }
    endIdx = i
    if (habilCount >= daysNeeded) break
  }

  return calendarDays[endIdx].date
}

  function isInSelection(date: string): boolean {
    if (!selecting || !hoverDate) return date === selecting
    const start = selecting < hoverDate ? selecting : hoverDate
    const end   = selecting < hoverDate ? hoverDate : selecting
    return date >= start && date <= end
  }

  const remaining = availableDays - usedDays

  return (
    <div className={styles.container}>
      {/* Contador de días */}
      <div className={styles.counter}>
        <div className={styles.counterItem}>
          <span className={styles.counterNumber}>{availableDays}</span>
          <span className={styles.counterLabel}>días disponibles</span>
        </div>
        <div className={styles.counterDivider} />
        <div className={styles.counterItem}>
          <span className={styles.counterNumber}>{usedDays}</span>
          <span className={styles.counterLabel}>días planificados</span>
        </div>
        <div className={styles.counterDivider} />
        <div className={`${styles.counterItem} ${remaining < 0 ? styles.negative : ''}`}>
          <span className={styles.counterNumber}>{remaining}</span>
          <span className={styles.counterLabel}>días restantes</span>
        </div>
      </div>
      <div className={styles.legend}>
  <div className={styles.legendItem}>
    <div className={`${styles.legendDot} ${styles.legendHabil}`} />
    <span>Descuenta vacaciones</span>
  </div>
  <div className={styles.legendItem}>
    <div className={`${styles.legendDot} ${styles.legendFree}`} />
    <span>Descanso gratis</span>
  </div>
  <div className={styles.legendItem}>
    <div className={`${styles.legendDot} ${styles.legendHoliday}`} />
    <span>Feriado</span>
  </div>
</div>

      {selecting && (
        <p className={styles.hint}>
          📅 Ahora selecciona la fecha de término del período
        </p>
      )}

      {!selecting && (
        <p className={styles.hint}>
          Toca el día en que empezarían tus vacaciones
        </p>
      )}

      {/* Períodos agregados */}
      {periods.length > 0 && (
        <div className={styles.periodList}>
          {periods.map(p => (
            <div key={p.id} className={styles.periodTag}>
              <span>{formatShort(p.startDate)} → {formatShort(p.endDate)}</span>
              <button
                className={styles.removeBtn}
                onClick={() => onRemovePeriod(p.id)}
                aria-label="Eliminar período"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Calendarios por mes */}
      <div className={styles.months}>
        {monthGroups.map((monthDays, idx) => {
          const firstDate = new Date(monthDays[0].date + 'T00:00:00')
          const offset = (firstDate.getDay() + 6) % 7
          const monthName = MONTH_NAMES[firstDate.getMonth()]

          return (
            <div key={idx} className={styles.month}>
              <p className={styles.monthName}>{monthName}</p>
              <div className={styles.grid}>
                {DAY_NAMES.map((d, i) => (
                  <div key={i} className={styles.dayLabel}>{d}</div>
                ))}
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}
                {monthDays.map(day => {
  const inPeriod    = isInPeriod(day.date, periods)
  const inSelection = isInSelection(day.date)
  const isStart     = isPeriodStart(day.date, periods) || day.date === selecting
  const isEnd       = isPeriodEnd(day.date, periods)
  const isNonWork   = day.dayType === 'fin_de_semana' || day.dayType === 'feriado'
  const isHabil     = isVacationHabil(day)
  const dayNum      = new Date(day.date + 'T00:00:00').getDate()
  const isToday     = day.date === todayStr

  return (
    <div
      key={day.date}
      className={[
        styles.day,
        isNonWork   ? styles.nonWork   : styles.workday,
        inPeriod && isHabil  ? styles.inPeriod     : '',  // ← descuenta: azul oscuro
        inPeriod && !isHabil ? styles.inPeriodFree : '',  // ← no descuenta: azul claro
        inSelection ? styles.inSelect  : '',
        isStart     ? styles.rangeStart : '',
        isEnd       ? styles.rangeEnd   : '',
        day.holiday ? styles.holiday    : '',
        isToday     ? styles.today      : '',
        selecting && !isNonWork ? styles.selectable : '',
      ].filter(Boolean).join(' ')}
      onClick={() => handleDayClick(day.date, day.dayType)}
      onMouseEnter={() => selecting && setHoverDate(day.date)}
      onMouseLeave={() => selecting && setHoverDate(null)}
      title={day.holiday?.name ?? (inPeriod && !isHabil ? 'No descuenta de tus vacaciones' : undefined)}
    >
      {dayNum}
      {day.holiday && <span className={styles.dot} />}
    </div>
  )
})}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}