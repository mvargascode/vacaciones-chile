import type { VacationWindow } from '../types/recommendation.types'
import type { PeriodAnalysis } from './plannerService'

const APP_URL = 'https://vacaciones-chile.vercel.app'

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
  })
}

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

Planifica las tuyas en 👇
${APP_URL}`
}

export function buildShareTextPlanned(analysis: PeriodAnalysis): string {
  const holidays    = analysis.holidaysInside.map(h => `• ${h.name}`).join('\n')
  const hasHolidays = analysis.holidaysInside.length > 0

  return `🏖️ *Mis vacaciones planificadas* 🏖️

📅 ${formatShortDate(analysis.period.startDate)} → ${formatShortDate(analysis.period.endDate)}

✅ Uso *${analysis.workdaysUsed} día${analysis.workdaysUsed !== 1 ? 's' : ''} de vacaciones*
🎉 Descanso *${analysis.totalDays} días* en total
😴 *${analysis.totalDays - analysis.workdaysUsed} días gratis* (feriados + fines de semana)
${hasHolidays ? `\nFeriados incluidos:\n${holidays}` : ''}

Planifica las tuyas en 👇
${APP_URL}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
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

function detectPlatform(): 'windows' | 'mac' | 'mobile' | 'web' {
  const ua = navigator.userAgent.toLowerCase()
  if (/android|iphone|ipad/.test(ua)) return 'mobile'
  if (/win/.test(ua)) return 'windows'
  if (/mac/.test(ua)) return 'mac'
  return 'web'
}

export function shareToWhatsApp(text: string): void {
  const encoded  = encodeURIComponent(text)
  const platform = detectPlatform()

  if (platform === 'mobile') {
    // Móvil: abre la app directamente
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  } else if (platform === 'windows' || platform === 'mac') {
    // Desktop con app instalada: intenta abrir la app nativa
    // Si no está instalada cae a WhatsApp Web
    const appLink = document.createElement('a')
    appLink.href  = `whatsapp://send?text=${encoded}`
    appLink.click()

    // Fallback a WhatsApp Web después de 1.5s si no abrió la app
    setTimeout(() => {
      if (!document.hidden) {
        window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank')
      }
    }, 1500)
  } else {
    // Web genérico
    window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank')
  }
}