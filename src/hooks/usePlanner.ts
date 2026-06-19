import { useMemo } from 'react'
import { analyzeAllPeriods, totalWorkdaysUsed } from '../services/plannerService'
import type { PeriodAnalysis } from '../services/plannerService'
import type { PlannedPeriod, Sector } from '../types/user.types'
import type { CalendarDay } from '../types/calendar.types'

interface UsePlannerResult {
  analyses: PeriodAnalysis[]
  totalUsed: number
  remaining: number
}

export function usePlanner(
  periods: PlannedPeriod[],
  calendarDays: CalendarDay[],
  availableDays: number,
  sector: Sector = 'privado'   // ← nuevo
): UsePlannerResult {
  return useMemo(() => {
    const analyses  = analyzeAllPeriods(periods, calendarDays, sector)
    const totalUsed = totalWorkdaysUsed(analyses)
    const remaining = availableDays - totalUsed
    return { analyses, totalUsed, remaining }
  }, [periods, calendarDays, availableDays, sector])
}