import { useMemo } from "react";
import { buildYearCalendar } from "../services/calendarService";
import { generateRecommendations } from "../services/recommendationService";
import { useHolidays } from "./useHolidays";
import type { VacationWindow } from "../types/recommendation.types";

export function useRecommendations(
  year: number,
  region: string,
  availableDays: number,
): VacationWindow[] {
  const holidays = useHolidays(year, region);

  return useMemo(() => {
    const calendar = buildYearCalendar(year, holidays);
    return generateRecommendations(calendar, availableDays);
  }, [year, holidays, availableDays]);
}
