import type { Holiday } from "./holiday.types";
import type { CalendarDay } from "./calendar.types";

export type RecommendationTier = "oro" | "plata" | "bronce" | "gratis";

export interface VacationWindow {
  id: string;
  startDate: string;
  endDate: string;
  totalDaysOff: number;
  vacationDaysRequired: number;
  efficiency: number;
  holidays: Holiday[];
  tier: RecommendationTier;
  description: string;
  days: CalendarDay[];
}
