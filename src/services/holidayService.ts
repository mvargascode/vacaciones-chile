import type { Holiday } from "../types/holiday.types";
import { HOLIDAYS_2025 } from "../data/holidays/2025";
import { HOLIDAYS_2026 } from "../data/holidays/2026";

const HOLIDAYS_BY_YEAR: Record<number, Holiday[]> = {
  2025: HOLIDAYS_2025,
  2026: HOLIDAYS_2026,
};

export function getHolidaysForRegion(year: number, region: string): Holiday[] {
  const all = HOLIDAYS_BY_YEAR[year] ?? [];
  return all.filter(
    (h) => h.type !== "regional" || (h.regions?.includes(region) ?? false),
  );
}

export function isHoliday(
  date: string,
  holidays: Holiday[],
): Holiday | undefined {
  return holidays.find((h) => h.date === date);
}
