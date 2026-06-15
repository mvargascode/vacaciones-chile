import type { Holiday } from "./holiday.types";

export type DayType = "laborable" | "feriado" | "fin_de_semana" | "vacacion";

export interface CalendarDay {
  date: string;
  dayOfWeek: number;
  dayType: DayType;
  holiday?: Holiday;
  isPartOfBridge: boolean;
}
