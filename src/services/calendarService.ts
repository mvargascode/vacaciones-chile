import type { CalendarDay, DayType } from "../types/calendar.types";
import type { Holiday } from "../types/holiday.types";
import { isHoliday } from "./holidayService";

export function buildYearCalendar(
  year: number,
  holidays: Holiday[],
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    const dayOfWeek = d.getDay();
    const holiday = isHoliday(dateStr, holidays);

    let dayType: DayType;
    if (holiday) dayType = "feriado";
    else if (dayOfWeek === 0 || dayOfWeek === 6) dayType = "fin_de_semana";
    else dayType = "laborable";

    days.push({
      date: dateStr,
      dayOfWeek,
      dayType,
      holiday,
      isPartOfBridge: false,
    });
  }

  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function isWorkday(day: CalendarDay): boolean {
  return day.dayType === "laborable";
}
