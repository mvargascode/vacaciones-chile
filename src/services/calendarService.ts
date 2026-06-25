import type { CalendarDay, DayType, VacationDayType } from '../types/calendar.types'
import type { Holiday } from '../types/holiday.types'
import { isHoliday } from './holidayService'

export function buildYearCalendar(year: number, holidays: Holiday[]): CalendarDay[] {
  const days: CalendarDay[] = []
  const start = new Date(year, 0, 1)
  const end   = new Date(year, 11, 31)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr   = formatDate(d)
    const dayOfWeek = d.getDay()   // 0=domingo, 6=sábado
    const holiday   = isHoliday(dateStr, holidays)

    // Tipo visual del día (para el calendario)
    let dayType: DayType
    if (holiday)                                  dayType = 'feriado'
    else if (dayOfWeek === 0 || dayOfWeek === 6)  dayType = 'fin_de_semana'
    else                                          dayType = 'laborable'

    // Tipo legal para efectos de vacaciones
    // Ley chilena: descuentan lunes a viernes que NO sean feriado
    let vacationDayType: VacationDayType
    if (holiday) {
      vacationDayType = 'inhabil_feriado'  // feriado nunca descuenta
    } else if (dayOfWeek === 0) {
      vacationDayType = 'inhabil_domingo'  // domingo nunca descuenta
    } else {
      vacationDayType = 'habil'            // lun-sáb sin feriado (sáb se filtra en isVacationHabil)
    }

    days.push({
      date: dateStr,
      dayOfWeek,
      dayType,
      vacationDayType,
      holiday,
      isPartOfBridge: false,
    })
  }

  return days
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Día laborable para efectos de PUENTES (lun-vie sin feriado)
// Se usa en el algoritmo de recomendaciones
export function isWorkday(day: CalendarDay): boolean {
  return day.dayType === 'laborable'
}

// Día hábil para efectos de vacaciones según sector
// Privado y público: lunes a viernes sin feriados
// El sábado no descuenta en ningún sector
export function isVacationHabil(day: CalendarDay, sector: 'privado' | 'publico' = 'privado'): boolean {
  if (day.vacationDayType === 'inhabil_feriado') return false
  if (day.vacationDayType === 'inhabil_domingo') return false
  if (day.dayOfWeek === 6) return false  // sábado no descuenta en ningún sector
  return day.vacationDayType === 'habil'
}