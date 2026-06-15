import type { CalendarDay } from "../types/calendar.types";
import type {
  VacationWindow,
  RecommendationTier,
} from "../types/recommendation.types";
import { isWorkday } from "./calendarService";

const MAX_VACATION_DAYS = 10;
const MAX_GAP_TO_BRIDGE = 4;

export function generateRecommendations(
  calendarDays: CalendarDay[],
  availableDays: number,
): VacationWindow[] {
  const windows: VacationWindow[] = [];

  for (let i = 0; i < calendarDays.length; i++) {
    if (calendarDays[i].dayType !== "feriado") continue;

    let start = i;
    while (start > 0) {
      let backIdx = start - 1;
      while (backIdx >= 0 && calendarDays[backIdx].dayType === "laborable")
        backIdx--;
      if (backIdx < 0 || start - backIdx > MAX_GAP_TO_BRIDGE) break;
      start = backIdx;
    }

    let end = i;
    while (end < calendarDays.length - 1) {
      let fwdIdx = end + 1;
      while (
        fwdIdx < calendarDays.length &&
        calendarDays[fwdIdx].dayType === "laborable"
      )
        fwdIdx++;
      if (fwdIdx >= calendarDays.length || fwdIdx - end > MAX_GAP_TO_BRIDGE)
        break;
      end = fwdIdx;
    }

    const windowDays = calendarDays.slice(start, end + 1);
    const vacationDaysRequired = windowDays.filter(isWorkday).length;

    if (vacationDaysRequired === 0) continue;
    if (vacationDaysRequired > availableDays) continue;
    if (vacationDaysRequired > MAX_VACATION_DAYS) continue;
    if (windows.some((w) => w.startDate === windowDays[0].date)) continue;

    const totalDaysOff = windowDays.length;
    const efficiency =
      Math.round((totalDaysOff / vacationDaysRequired) * 10) / 10;
    const holidays = windowDays.filter((d) => d.holiday).map((d) => d.holiday!);

    windows.push({
      id: `${windowDays[0].date}_${windowDays[windowDays.length - 1].date}`,
      startDate: windowDays[0].date,
      endDate: windowDays[windowDays.length - 1].date,
      totalDaysOff,
      vacationDaysRequired,
      efficiency,
      holidays,
      tier: getTier(efficiency),
      description: buildDescription(
        holidays[0]?.name,
        vacationDaysRequired,
        totalDaysOff,
      ),
      days: windowDays,
    });
  }

  return windows.sort((a, b) => b.efficiency - a.efficiency);
}

function getTier(efficiency: number): RecommendationTier {
  if (efficiency >= 3.0) return "oro";
  if (efficiency >= 2.0) return "plata";
  return "bronce";
}

function buildDescription(
  name: string | undefined,
  vacDays: number,
  totalDays: number,
): string {
  return `${name ?? "Feriado"}: ${totalDays} días libres usando solo ${vacDays} de vacaciones`;
}
