import type { VacationWindow } from '../types/recommendation.types'
import type { PeriodAnalysis } from './plannerService'

const APP_URL = 'https://vacaciones-chile.vercel.app'

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
  })
}

// Genera texto para compartir una oportunidad del dashboard
export function buildShareTextOpportunity(r: VacationWindow): string {
  const tierEmoji = r.tier === 'oro' ? '🥇' : r.tier === 'plata' ? '🥈' : '🥉'
  const holidays  = r.holidays.map(h => `• ${h.name}`).join('\n')

  return `${tierEmoji} *Oportunidad de vacaciones en Chile* ${tierEmoji}

📅 ${formatShortDate(r.startDate)} → ${formatShortDate(r.endDate)}

✅ Solo uso *${r.vacationDaysRequired} día${r.vacationDaysRequired !== 1 ? 's' : ''} de vacaciones*
🎉 Descanso *${r.totalDaysOff} días* en total
⚡ Eficiencia: *${r.efficiency}x*

Feriados incluidos:
${holidays}

Planifica tus vacaciones en 👇
${APP_URL}`
}

// Genera texto para compartir un período planificado
export function buildShareTextPlanned(analysis: PeriodAnalysis): string {
  const holidays = analysis.holidaysInside.map(h => `• ${h.name}`).join('\n')
  const hasHolidays = analysis.holidaysInside.length > 0

  return `🇨🇱 *Mis vacaciones planificadas* 🇨🇱

📅 ${formatShortDate(analysis.period.startDate)} → ${formatShortDate(analysis.period.endDate)}

✅ Uso *${analysis.workdaysUsed} día${analysis.workdaysUsed !== 1 ? 's' : ''} de vacaciones*
🎉 Descanso *${analysis.totalDays} días* en total
😴 *${analysis.totalDays - analysis.workdaysUsed} días gratis* (feriados + fines de semana)
${hasHolidays ? `\nFeriados incluidos:\n${holidays}` : ''}

Planifica las tuyas en 👇
${APP_URL}`
}

// Copia el texto al portapapeles
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback para navegadores sin clipboard API
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity  = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  }
}

// Abre WhatsApp directamente con el texto
export function shareToWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}