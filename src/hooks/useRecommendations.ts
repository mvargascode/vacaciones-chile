import { useMemo } from 'react'
import { buildYearCalendar } from '../services/calendarService'
import { generateRecommendations } from '../services/recommendationService'
import type { VacationWindow } from '../types/recommendation.types'
import type { Holiday } from '../types/holiday.types'

export function useRecommendations(
  year: number,
  holidays: Holiday[],
): VacationWindow[] {
  return useMemo(() => {
    if (holidays.length === 0) return []
    const calendar = buildYearCalendar(year, holidays)
    return generateRecommendations(calendar)
  }, [year, holidays])
}
