import { useMemo } from 'react'
import { getHolidaysForRegion } from '../services/holidayService'
import type { Holiday } from '../types/holiday.types'

// Hook síncrono con datos locales — para uso en onboarding
// donde no queremos esperar una llamada de red
export function useHolidays(year: number, region: string): Holiday[] {
  return useMemo(
    () => getHolidaysForRegion(year, region),
    [year, region]
  )
}