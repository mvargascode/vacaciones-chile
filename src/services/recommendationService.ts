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
    if (dow === 0 || dow === 6) continue;

    // Candidatos [startOffset, endOffset] relativos al índice del feriado.
    // Por cada feriado se generan hasta 3 ventanas:
    //   - Mínima: el puente más corto al fin de semana más cercano (1-2 días vac)
    //   - Máxima: captura ambos fines de semana (sáb previo → dom siguiente = 9 días)
    // Lun: solo opción gratis (extender hacia adelante no ancla a otro finde).
    // Vie: gratis + opción máxima (semana previa completa).
    const candidates: [number, number][] = [];

    switch (dow) {
      case 1: // Lun → solo fin de semana largo gratis [sáb–dom–lun]
        candidates.push([-2, 0]);
        break;
      case 2: // Mar → mínimo 1 día vac + máximo semana completa
        candidates.push([-3,  0]); // sáb–dom–lun(vac)–mar(h)
        candidates.push([-3, +5]); // sáb–dom–lun(vac)–mar(h)–mié(vac)–jue(vac)–vie(vac)–sáb–dom
        break;
      case 3: // Mié → mínimo atrás + mínimo adelante + máximo
        candidates.push([-4,  0]); // sáb–dom–lun(vac)–mar(vac)–mié(h)
        candidates.push([ 0, +4]); // mié(h)–jue(vac)–vie(vac)–sáb–dom
        candidates.push([-4, +4]); // sáb–dom–lun(vac)–mar(vac)–mié(h)–jue(vac)–vie(vac)–sáb–dom
        break;
      case 4: // Jue → mínimo 1 día vac + máximo semana completa
        candidates.push([ 0, +3]); // jue(h)–vie(vac)–sáb–dom
        candidates.push([-5, +3]); // sáb–dom–lun(vac)–mar(vac)–mié(vac)–jue(h)–vie(vac)–sáb–dom
        break;
      case 5: // Vie → gratis + máximo (semana completa hacia atrás)
        candidates.push([ 0, +2]); // vie(h)–sáb–dom
        candidates.push([-6, +2]); // sáb–dom–lun(vac)–mar(vac)–mié(vac)–jue(vac)–vie(h)–sáb–dom
        break;
    }

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
        description: buildDescription(vacDays, totalDays),
        days: slice,
      });
    }
  }

  // Eliminar ventanas dominadas: W se elimina si existe O que la contiene
  // estrictamente Y tiene igual o mejor eficiencia (O es objetivamente superior).
  // Esto fusiona las ventanas redundantes de feriados consecutivos (ej: jue+vie)
  // sin eliminar las opciones mínimas que coexisten con las máximas
  // (la mínima siempre tiene mejor eficiencia que la máxima que la contiene).
  const deduped = windows.filter(w =>
    !windows.some(other =>
      other !== w &&
      other.startDate <= w.startDate &&
      other.endDate >= w.endDate &&
      (other.startDate < w.startDate || other.endDate > w.endDate) &&
      other.efficiency >= w.efficiency
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
  if (efficiency >= 4.0) return "oro";
  if (efficiency >= 2.0) return "plata";
  return "bronce";
}

function buildDescription(vacDays: number, totalDays: number): string {
  if (vacDays === 0) {
    return `Fin de semana largo — ${totalDays} día${totalDays !== 1 ? 's' : ''} libres sin gastar vacaciones`;
  }
  return `Pide ${vacDays} día${vacDays !== 1 ? 's' : ''} de vacaciones y descansa ${totalDays} días seguidos`;
}
