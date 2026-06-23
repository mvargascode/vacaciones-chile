export type Sector = 'privado' | 'publico'

export interface PlannedPeriod {
  id: string
  startDate: string
  endDate: string
  label?: string
}

export interface UserPreferences {
  region: string
  totalAvailableDays: number   // ← días totales acumulados (antes availableDays)
  daysToUse: number            // ← días que quiere usar ahora (nuevo)
  year: number
  plannedPeriods: PlannedPeriod[]
  sector: Sector
}