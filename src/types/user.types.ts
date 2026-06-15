export interface PlannedPeriod {
  id: string;
  startDate: string;
  endDate: string;
  label?: string;
}

export interface UserPreferences {
  region: string;
  availableDays: number;
  year: number;
  plannedPeriods: PlannedPeriod[]; // ← nuevo
}
