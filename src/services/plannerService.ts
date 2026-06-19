import type { PlannedPeriod } from '../types/user.types'
import type { Holiday } from '../types/holiday.types'
import type { CalendarDay } from '../types/calendar.types'
import { isVacationHabil } from './calendarService'

export interface PeriodAnalysis {
  period: PlannedPeriod
  // Días que descuentan legalmente de las vacaciones (lun-sáb sin feriado)
  workdaysUsed: number
  // Feriados dentro del período (no descuentan de vacaciones)
  holidaysInside: Holiday[]
  // Domingos dentro del período
  sundaysInside: number
  // Sábados dentro del período (sí descuentan)
  saturdaysInside: number
  // Total días corridos
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

const NEARBY_DAYS = 4

export function analyzePeriod(
  period: PlannedPeriod,
  calendarDays: CalendarDay[]
): PeriodAnalysis {
  const startIdx = calendarDays.findIndex(d => d.date === period.startDate)
  const endIdx   = calendarDays.findIndex(d => d.date === period.endDate)

  if (startIdx === -1 || endIdx === -1) {
    return {
      period,
      workdaysUsed: 0,
      holidaysInside: [],
      sundaysInside: 0,
      saturdaysInside: 0,
      totalDays: 0,
      suggestions: [],
    }
  }

  const periodDays = calendarDays.slice(startIdx, endIdx + 1)

  // Días que descuentan legalmente (lun-sáb sin feriado)
  const workdaysUsed   = periodDays.filter(isVacationHabil).length
  const holidaysInside = periodDays.filter(d => d.holiday).map(d => d.holiday!)
  const sundaysInside  = periodDays.filter(d => d.dayOfWeek === 0).length
  const saturdaysInside = periodDays.filter(d => d.dayOfWeek === 6 && !d.holiday).length
  const totalDays      = periodDays.length

  const suggestions = generateSuggestions(calendarDays, startIdx, endIdx)

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
  endIdx: number
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = []

  // Buscar feriados ANTES del inicio
  const beforeRange = calendarDays.slice(Math.max(0, startIdx - NEARBY_DAYS), startIdx)
  for (const day of [...beforeRange].reverse()) {
    if (day.holiday) {
      const idx          = calendarDays.indexOf(day)
      const bridgeDays   = calendarDays.slice(idx, startIdx)
      const daysAdjusted = bridgeDays.length
      const workdaysSaved = bridgeDays.filter(isVacationHabil).length

      if (workdaysSaved > 0) {
        suggestions.push({
          type: 'extend_start',
          description: `Empieza ${daysAdjusted} días antes para incluir ${day.holiday.name}`,
          holidayName: day.holiday.name,
          suggestedDate: day.date,
          daysAdjusted,
          workdaysSaved,
        })
      }
      break
    }
  }

  // Buscar feriados DESPUÉS del fin
  const afterRange = calendarDays.slice(endIdx + 1, Math.min(calendarDays.length, endIdx + NEARBY_DAYS + 1))
  for (const day of afterRange) {
    if (day.holiday) {
      const idx           = calendarDays.indexOf(day)
      const bridgeDays    = calendarDays.slice(endIdx + 1, idx + 1)
      const daysAdjusted  = bridgeDays.length
      const workdaysSaved = bridgeDays.filter(isVacationHabil).length

      if (workdaysSaved > 0) {
        suggestions.push({
          type: 'extend_end',
          description: `Extiende ${daysAdjusted} días para incluir ${day.holiday.name}`,
          holidayName: day.holiday.name,
          suggestedDate: day.date,
          daysAdjusted,
          workdaysSaved,
        })
      }
      break
    }
  }

  return suggestions
}

export function analyzeAllPeriods(
  periods: PlannedPeriod[],
  calendarDays: CalendarDay[]
): PeriodAnalysis[] {
  return periods.map(p => analyzePeriod(p, calendarDays))
}

export function totalWorkdaysUsed(analyses: PeriodAnalysis[]): number {
  return analyses.reduce((sum, a) => sum + a.workdaysUsed, 0)
}