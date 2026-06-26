import { useState } from 'react'
import type { CalendarDay } from '../../types/calendar.types'
import type { PlannedPeriod } from '../../types/user.types'
import styles from './PeriodPicker.module.css'
import { isVacationHabil } from '../../services/calendarService'

type PlannerMode = 'select' | 'auto' | 'manual'

interface PeriodPickerProps {
  calendarDays: CalendarDay[]
  periods: PlannedPeriod[]
  onAddPeriod: (period: PlannedPeriod) => void
  onRemovePeriod: (id: string) => void
  availableDays: number
  usedDays: number
  onDone?: () => void
}

const todayStr = new Date().toISOString().split('T')[0]

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
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

function formatShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short',
  })
}

export function PeriodPicker({
  calendarDays,
  periods,
  onAddPeriod,
  onRemovePeriod,
  availableDays,
  usedDays,
  onDone,
}: PeriodPickerProps) {
  const [mode, setMode] = useState<PlannerMode>(
    periods.length > 0 ? 'manual' : 'select'
  )
  const [selecting, setSelecting] = useState<string | null>(null)
  const [hoverDate, setHoverDate] = useState<string | null>(null)

  const remaining = availableDays - usedDays

  const today = new Date()
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString().split('T')[0]
  const futureDays  = calendarDays.filter(d => d.date >= currentMonthStart)
  const monthGroups = groupByMonth(futureDays)

  function calculateAutoEnd(startDate: string, daysNeeded: number): string {
    const startIdx = calendarDays.findIndex(d => d.date === startDate)
    if (startIdx === -1 || daysNeeded <= 0) return startDate
    let habilCount = 0
    let endIdx = startIdx
    for (let i = startIdx; i < calendarDays.length; i++) {
      if (isVacationHabil(calendarDays[i])) habilCount++
      endIdx = i
      if (habilCount >= daysNeeded) break
    }
    return calendarDays[endIdx].date
  }

  function handleDayClickAuto(date: string, dayType: string) {
    if (dayType === 'fin_de_semana' || dayType === 'feriado') return
    if (remaining <= 0) return
    const autoEnd = calculateAutoEnd(date, remaining)
    onAddPeriod({ id: `${date}_${autoEnd}_${Date.now()}`, startDate: date, endDate: autoEnd })
  }

  function handleDayClickManual(date: string, dayType: string) {
    if (dayType === 'fin_de_semana' || dayType === 'feriado') return
    if (!selecting) {
      if (remaining <= 0) return
      setSelecting(date)
    } else {
      const start = selecting < date ? selecting : date
      const end   = selecting < date ? date : selecting
      onAddPeriod({ id: `${start}_${end}_${Date.now()}`, startDate: start, endDate: end })
      setSelecting(null)
      setHoverDate(null)
    }
  }

  function isInSelection(date: string): boolean {
    if (!selecting || !hoverDate) return date === selecting
    const start = selecting < hoverDate ? selecting : hoverDate
    const end   = selecting < hoverDate ? hoverDate : selecting
    return date >= start && date <= end
  }

  // ─── Pantalla de selección de modo ───────────────────────────────────────
  if (mode === 'select') {
    return (
      <div className={styles.container}>
        <div className={styles.modeSelect}>
          <p className={styles.modeQuestion}>
            Tienes <strong>{availableDays} días</strong> de vacaciones.<br />
            ¿Cómo quieres planificarlos?
          </p>

          <button className={styles.modeOption} onClick={() => setMode('auto')}>
            <span className={styles.modeIcon}>📅</span>
            <div className={styles.modeText}>
              <span className={styles.modeTitle}>Automático</span>
              <span className={styles.modeDesc}>Elige el inicio y listo — el sistema asigna todos tus días</span>
            </div>
          </button>

          <button className={styles.modeOption} onClick={() => setMode('manual')}>
            <span className={styles.modeIcon}>✂️</span>
            <div className={styles.modeText}>
              <span className={styles.modeTitle}>Dividir en períodos</span>
              <span className={styles.modeDesc}>Reparte tus días en varios bloques a tu gusto</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ─── Calendario (compartido entre modos) ─────────────────────────────────
  const handleDayClick = mode === 'auto' ? handleDayClickAuto : handleDayClickManual
  const canSelect      = mode === 'auto' ? remaining > 0 : (remaining > 0 || !!selecting)

  function renderCalendar() {
    return (
      <div className={styles.months}>
        {monthGroups.map((monthDays, idx) => {
          const firstDate = new Date(monthDays[0].date + 'T00:00:00')
          const offset    = (firstDate.getDay() + 6) % 7
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
                        isNonWork              ? styles.nonWork      : styles.workday,
                        inPeriod && isHabil    ? styles.inPeriod     : '',
                        inPeriod && !isHabil   ? styles.inPeriodFree : '',
                        inSelection            ? styles.inSelect     : '',
                        isStart                ? styles.rangeStart   : '',
                        isEnd                  ? styles.rangeEnd     : '',
                        day.holiday            ? styles.holiday      : '',
                        isToday                ? styles.today        : '',
                        canSelect && !isNonWork ? styles.selectable  : '',
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
    )
  }

  // ─── Modo automático ──────────────────────────────────────────────────────
  if (mode === 'auto') {
    const hasPeriod = periods.length > 0

    return (
      <div className={styles.container}>
        {!hasPeriod && (
          <button className={styles.backBtn} onClick={() => setMode('select')}>
            ← Cambiar modo
          </button>
        )}

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

        {!hasPeriod && (
          <p className={styles.hint}>
            📅 Toca el día en que empezarían tus vacaciones — el sistema asignará tus {remaining} días automáticamente
          </p>
        )}

        {hasPeriod && (
          <>
            <div className={styles.autoResult}>
              <span className={styles.autoResultIcon}>✅</span>
              <div className={styles.autoResultText}>
                <span className={styles.autoResultTitle}>Vacaciones planificadas</span>
                {periods.map(p => (
                  <div key={p.id} className={styles.autoResultPeriod}>
                    <span>{formatShort(p.startDate)} → {formatShort(p.endDate)}</span>
                    <button
                      className={styles.autoResultRemove}
                      onClick={() => onRemovePeriod(p.id)}
                      aria-label="Cambiar fechas"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {onDone && (
              <button className={styles.doneBtn} onClick={onDone}>
                Ver resultados →
              </button>
            )}
          </>
        )}

        {!hasPeriod && renderCalendar()}
      </div>
    )
  }

  // ─── Modo manual ──────────────────────────────────────────────────────────
  const exhausted = remaining === 0 && !selecting

  return (
    <div className={styles.container}>
      {periods.length === 0 && (
        <button className={styles.backBtn} onClick={() => setMode('select')}>
          ← Cambiar modo
        </button>
      )}

      {/* Contador */}
      <div className={styles.counter}>
        <div className={styles.counterItem}>
          <span className={styles.counterNumber}>{availableDays}</span>
          <span className={styles.counterLabel}>disponibles</span>
        </div>
        <div className={styles.counterDivider} />
        <div className={styles.counterItem}>
          <span className={styles.counterNumber}>{usedDays}</span>
          <span className={styles.counterLabel}>planificados</span>
        </div>
        <div className={styles.counterDivider} />
        <div className={`${styles.counterItem} ${remaining < 0 ? styles.negative : ''}`}>
          <span className={`${styles.counterNumber} ${remaining > 0 ? styles.counterRemaining : ''}`}>
            {remaining}
          </span>
          <span className={styles.counterLabel}>restantes</span>
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

      {/* Hint / estado */}
      {selecting && (
        <p className={styles.hint}>
          📅 Ahora selecciona la fecha de término del período
        </p>
      )}
      {!selecting && remaining > 0 && (
        <p className={styles.hint}>
          {periods.length > 0
            ? `+ Agrega otro período — te quedan ${remaining} días`
            : 'Toca el día en que empezarían tus vacaciones'}
        </p>
      )}
      {exhausted && periods.length > 0 && (
        <div className={styles.exhaustedMsg}>
          <span>🎉</span>
          <p>No tienes más días de vacaciones disponibles. ¡Todo planificado!</p>
        </div>
      )}

      {/* Botón ver resultados cuando agotados */}
      {exhausted && periods.length > 0 && onDone && (
        <button className={styles.doneBtn} onClick={onDone}>
          Ver resultados →
        </button>
      )}

      {/* Calendario — solo si quedan días o está en medio de selección */}
      {(remaining > 0 || selecting) && renderCalendar()}
    </div>
  )
}
