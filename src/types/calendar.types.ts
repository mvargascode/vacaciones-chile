import type { Holiday } from './holiday.types'

export type DayType = 'laborable' | 'feriado' | 'fin_de_semana' | 'vacacion'

// Nuevo: clasificación para efectos de vacaciones legales
export type VacationDayType =
  | 'habil'           // Lunes a sábado sin feriado → descuenta de vacaciones
  | 'inhabil_domingo' // Domingo → NO descuenta
  | 'inhabil_feriado' // Feriado (cualquier día) → NO descuenta

export interface CalendarDay {
  date: string
  dayOfWeek: number
  dayType: DayType
  vacationDayType: VacationDayType   // ← nuevo
  holiday?: Holiday
  isPartOfBridge: boolean
}