import type { PlannedPeriod, Sector } from '../types/user.types'
import type { Holiday } from '../types/holiday.types'
import type { CalendarDay } from '../types/calendar.types'
import { isVacationHabil } from './calendarService'

export interface PeriodAnalysis {
  period: PlannedPeriod
  workdaysUsed: number
  holidaysInside: Holiday[]
  sundaysInside: number
  saturdaysInside: number
  totalDays: number
  suggestions: OptimizationSuggestion[]
}

export interface OptimizationSuggestion {
  type: 'extend_start' | 'extend_end'
  description: string
  holidayName: string
  suggestedDate: string
  daysAdjusted: number
  workdaysSaved: number
}
export interface OptimizationSuggestion {
  type: 'extend_start' | 'extend_end'
  description: string
  holidayName: string
  suggestedDate: string
  daysAdjusted: number
  workdaysSaved: number
  workdaysNeeded: number   // ← nuevo: días hábiles extra que necesita
}
const NEARBY_DAYS = 4

export function analyzePeriod(
  period: PlannedPeriod,
  calendarDays: CalendarDay[],
  sector: Sector = 'privado'
): PeriodAnalysis {
  const startIdx = calendarDays.findIndex(d => d.date === period.startDate)
  const endIdx   = calendarDays.findIndex(d => d.date === period.endDate)

  if (startIdx === -1 || endIdx === -1) {
    return {
      period,
      workdaysUsed:   0,
      holidaysInside: [],
      sundaysInside:  0,
      saturdaysInside: 0,
      totalDays:      0,
      suggestions:    [],
    }
  }

  const periodDays = calendarDays.slice(startIdx, endIdx + 1)

  const workdaysUsed    = periodDays.filter(d => isVacationHabil(d)).length
  const holidaysInside  = periodDays.filter(d => d.holiday).map(d => d.holiday!)
  const sundaysInside   = periodDays.filter(d => d.dayOfWeek === 0).length
  const saturdaysInside = periodDays.filter(d => d.dayOfWeek === 6 && !d.holiday).length
  const totalDays       = periodDays.length

  const suggestions = generateSuggestions(calendarDays, startIdx, endIdx, sector)

  return {
    period,
    workdaysUsed,
    holidaysInside,
    sundaysInside,
    saturdaysInside,
    totalDays,
    suggestions,
  }
}

function generateSuggestions(
  calendarDays: CalendarDay[],
  startIdx: number,
  endIdx: number,
  sector: Sector
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = []

  // Buscar feriados ANTES del inicio
  const beforeRange = calendarDays.slice(Math.max(0, startIdx - NEARBY_DAYS), startIdx)
  for (const day of [...beforeRange].reverse()) {
    if (day.holiday) {
      const idx           = calendarDays.indexOf(day)
      const bridgeDays    = calendarDays.slice(idx, startIdx)
      const daysAdjusted  = bridgeDays.length
      const workdaysSaved = bridgeDays.filter(d => isVacationHabil(d)).length

      if (workdaysSaved > 0) {
        suggestions.push({
  type:           'extend_start',
  description:    `Empieza ${daysAdjusted} días antes para incluir ${day.holiday.name}`,
  holidayName:    day.holiday.name,
  suggestedDate:  day.date,
  daysAdjusted,
  workdaysSaved:  0,
  workdaysNeeded: workdaysSaved,  // días hábiles extra que necesita
})

      }
      break
    }
  }

  // Buscar feriados DESPUÉS del fin
  const afterRange = calendarDays.slice(
    endIdx + 1,
    Math.min(calendarDays.length, endIdx + NEARBY_DAYS + 1)
  )
  for (const day of afterRange) {
    if (day.holiday) {
      const idx           = calendarDays.indexOf(day)
      const bridgeDays    = calendarDays.slice(endIdx + 1, idx + 1)
      const daysAdjusted  = bridgeDays.length
      const workdaysSaved = bridgeDays.filter(d => isVacationHabil(d)).length

      if (workdaysSaved > 0) {
        suggestions.push({
  type:          'extend_end',
  description:   `Extiende ${daysAdjusted} días para incluir ${day.holiday.name}`,
  holidayName:   day.holiday.name,
  suggestedDate: day.date,
  daysAdjusted,
  workdaysSaved,
  workdaysNeeded: workdaysSaved,  // extend_end necesita días hábiles extra
})
      }
      break
    }
  }

  return suggestions
}

export function analyzeAllPeriods(
  periods: PlannedPeriod[],
  calendarDays: CalendarDay[],
  sector: Sector = 'privado'
): PeriodAnalysis[] {
  return periods.map(p => analyzePeriod(p, calendarDays, sector))
}

export function totalWorkdaysUsed(analyses: PeriodAnalysis[]): number {
  return analyses.reduce((sum, a) => sum + a.workdaysUsed, 0)
}

// Recalcula el fin del período manteniendo los mismos días hábiles
// cuando se mueve el inicio hacia atrás
export function recalculateEndDate(
  newStartDate: string,
  workdaysTarget: number,
  calendarDays: CalendarDay[],
  sector: Sector
): string {
  const startIdx = calendarDays.findIndex(d => d.date === newStartDate)
  if (startIdx === -1) return newStartDate

  let count  = 0
  let endIdx = startIdx

  for (let i = startIdx; i < calendarDays.length; i++) {
    if (isVacationHabil(calendarDays[i])) count++
    endIdx = i
    if (count >= workdaysTarget) break
  }

  return calendarDays[endIdx].date
}