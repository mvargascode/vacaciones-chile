import type { PlannedPeriod } from "../types/user.types";
import type { Holiday } from "../types/holiday.types";
import type { CalendarDay } from "../types/calendar.types";
import { isWorkday } from "./calendarService";

export interface PeriodAnalysis {
  period: PlannedPeriod;
  workdaysUsed: number;
  holidaysInside: Holiday[];
  weekendsInside: number;
  totalDays: number;
  // Sugerencias de optimización
  suggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: "extend_start" | "extend_end" | "shift_start" | "shift_end";
  description: string;
  holidayName: string;
  suggestedDate: string;
  daysAdjusted: number;
  workdaysSaved: number;
}

// Cuántos días antes/después buscamos feriados cercanos
const NEARBY_DAYS = 4;

export function analyzePeriod(
  period: PlannedPeriod,
  calendarDays: CalendarDay[],
): PeriodAnalysis {
  const start = calendarDays.findIndex((d) => d.date === period.startDate);
  const end = calendarDays.findIndex((d) => d.date === period.endDate);

  if (start === -1 || end === -1) {
    return {
      period,
      workdaysUsed: 0,
      holidaysInside: [],
      weekendsInside: 0,
      totalDays: 0,
      suggestions: [],
    };
  }

  const periodDays = calendarDays.slice(start, end + 1);
  const workdaysUsed = periodDays.filter(isWorkday).length;
  const holidaysInside = periodDays
    .filter((d) => d.holiday)
    .map((d) => d.holiday!);
  const weekendsInside = periodDays.filter(
    (d) => d.dayType === "fin_de_semana",
  ).length;
  const totalDays = periodDays.length;

  const suggestions = generateSuggestions(period, calendarDays, start, end);

  return {
    period,
    workdaysUsed,
    holidaysInside,
    weekendsInside,
    totalDays,
    suggestions,
  };
}

function generateSuggestions(
  period: PlannedPeriod,
  calendarDays: CalendarDay[],
  startIdx: number,
  endIdx: number,
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  // Buscar feriados ANTES del inicio del período
  const beforeStart = calendarDays.slice(
    Math.max(0, startIdx - NEARBY_DAYS),
    startIdx,
  );
  for (const day of beforeStart.reverse()) {
    if (day.holiday) {
      const daysAdjusted = calendarDays.slice(
        calendarDays.indexOf(day),
        startIdx,
      ).length;
      const workdaysSaved = calendarDays
        .slice(calendarDays.indexOf(day), startIdx)
        .filter(isWorkday).length;

      if (workdaysSaved > 0) {
        suggestions.push({
          type: "extend_start",
          description: `Empieza ${daysAdjusted} días antes para incluir ${day.holiday.name}`,
          holidayName: day.holiday.name,
          suggestedDate: day.date,
          daysAdjusted,
          workdaysSaved,
        });
      }
      break;
    }
  }

  // Buscar feriados DESPUÉS del fin del período
  const afterEnd = calendarDays.slice(
    endIdx + 1,
    Math.min(calendarDays.length, endIdx + NEARBY_DAYS + 1),
  );
  for (const day of afterEnd) {
    if (day.holiday) {
      const daysAdjusted = calendarDays.slice(
        endIdx + 1,
        calendarDays.indexOf(day) + 1,
      ).length;
      const workdaysSaved = calendarDays
        .slice(endIdx + 1, calendarDays.indexOf(day) + 1)
        .filter(isWorkday).length;

      if (workdaysSaved > 0) {
        suggestions.push({
          type: "extend_end",
          description: `Extiende ${daysAdjusted} días para incluir ${day.holiday.name}`,
          holidayName: day.holiday.name,
          suggestedDate: day.date,
          daysAdjusted,
          workdaysSaved,
        });
      }
      break;
    }
  }

  return suggestions;
}

export function analyzeAllPeriods(
  periods: PlannedPeriod[],
  calendarDays: CalendarDay[],
): PeriodAnalysis[] {
  return periods.map((p) => analyzePeriod(p, calendarDays));
}

// Días totales usados en todos los períodos
export function totalWorkdaysUsed(analyses: PeriodAnalysis[]): number {
  return analyses.reduce((sum, a) => sum + a.workdaysUsed, 0);
}
