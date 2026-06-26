import type { CalendarDay } from "../types/calendar.types";
import type {
  VacationWindow,
  RecommendationTier,
} from "../types/recommendation.types";
import { isWorkday } from "./calendarService";

export function generateRecommendations(calendarDays: CalendarDay[]): VacationWindow[] {
  const windows: VacationWindow[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < calendarDays.length; i++) {
    const day = calendarDays[i];
    if (day.dayType !== "feriado") continue;

    const dow = day.dayOfWeek; // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb

    // [startOffset, endOffset] relativos al índice del feriado
    const candidates: [number, number][] = [];

    if (dow === 0) candidates.push([-1, 0]);       // Dom: Sáb–Dom (gratis)
    else if (dow === 1) candidates.push([-2, 0]);  // Lun: Sáb–Dom–Lun (gratis)
    else if (dow === 2) candidates.push([-3, 0]);  // Mar: Sáb–Dom–Lun–Mar (1 día vac)
    else if (dow === 3) {
      candidates.push([-4, 0]); // Mié opción A: Sáb–Dom–Lun–Mar–Mié (2 días vac)
      candidates.push([0, 4]);  // Mié opción B: Mié–Jue–Vie–Sáb–Dom (2 días vac)
    }
    else if (dow === 4) candidates.push([0, 3]);   // Jue: Jue–Vie–Sáb–Dom (1 día vac)
    else if (dow === 5) candidates.push([0, 2]);   // Vie: Vie–Sáb–Dom (gratis)
    else if (dow === 6) candidates.push([0, 1]);   // Sáb: Sáb–Dom (gratis)

    for (const [startOff, endOff] of candidates) {
      const s = Math.max(0, i + startOff);
      const e = Math.min(calendarDays.length - 1, i + endOff);
      const slice = calendarDays.slice(s, e + 1);

      const key = `${slice[0].date}_${slice[slice.length - 1].date}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const vacDays = slice.filter(isWorkday).length;
      const totalDays = slice.length;
      const efficiency = vacDays === 0
        ? Infinity
        : Math.round((totalDays / vacDays) * 10) / 10;
      const holidays = slice.filter(d => d.holiday).map(d => d.holiday!);

      windows.push({
        id: key,
        startDate: slice[0].date,
        endDate: slice[slice.length - 1].date,
        totalDaysOff: totalDays,
        vacationDaysRequired: vacDays,
        efficiency,
        holidays,
        tier: getTier(efficiency, vacDays),
        description: buildDescription(day.holiday?.name, vacDays, totalDays),
        days: slice,
      });
    }
  }

  // Eliminar ventanas que son subconjunto de otra ventana más grande
  const deduped = windows.filter(w =>
    !windows.some(other =>
      other !== w &&
      other.startDate <= w.startDate &&
      other.endDate >= w.endDate &&
      (other.startDate < w.startDate || other.endDate > w.endDate)
    )
  );

  return deduped.sort((a, b) => {
    if (!isFinite(a.efficiency) && !isFinite(b.efficiency)) return 0;
    if (!isFinite(a.efficiency)) return -1;
    if (!isFinite(b.efficiency)) return 1;
    return b.efficiency - a.efficiency;
  });
}

function getTier(efficiency: number, vacDays: number): RecommendationTier {
  if (vacDays === 0) return "gratis";
  if (efficiency >= 3.0) return "oro";
  if (efficiency >= 2.0) return "plata";
  return "bronce";
}

function buildDescription(name: string | undefined, vacDays: number, totalDays: number): string {
  if (vacDays === 0) return `${name ?? "Feriado"}: ${totalDays} días libres sin gastar vacaciones`;
  return `${name ?? "Feriado"}: ${totalDays} días libres usando solo ${vacDays} de vacaciones`;
}
