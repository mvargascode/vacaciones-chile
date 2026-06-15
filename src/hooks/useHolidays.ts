import { useMemo } from "react";
import { getHolidaysForRegion } from "../services/holidayService";
import type { Holiday } from "../types/holiday.types";

export function useHolidays(year: number, region: string): Holiday[] {
  // useMemo evita recalcular si year y region no cambiaron
  return useMemo(() => getHolidaysForRegion(year, region), [year, region]);
}
