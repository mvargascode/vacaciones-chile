import type { VacationWindow } from '../types/recommendation.types'
import type { PeriodAnalysis } from './plannerService'

// ── Calendar helpers ──────────────────────────────────────────────────────────

function dateFmt(dateStr: string, offsetDays = 0): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function buildIcs(
  id: string,
  startDate: string,
  endDate: string,
  vacationDays: number,
  holidays: { name: string }[],
  totalDays: number,
): string {
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  const holidayLabel = holidays.length === 1 ? 'feriado incluido' : 'feriados incluidos'
  const description = [
    'Vacaciones planificadas con Vacaciones Chile',
    `• ${vacationDays} día${vacationDays !== 1 ? 's' : ''} hábile${vacationDays !== 1 ? 's' : ''} solicitado${vacationDays !== 1 ? 's' : ''}`,
    `• ${holidays.length} ${holidayLabel} (${holidays.map(h => h.name).join(', ')})`,
    `• ${totalDays} día${totalDays !== 1 ? 's' : ''} de descanso en total`,
  ].join('\\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vacaciones Chile//ES',
    'BEGIN:VEVENT',
    `UID:${id}@vacaciones-chile`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dateFmt(startDate)}`,
    `DTEND;VALUE=DATE:${dateFmt(endDate, 1)}`,
    'SUMMARY:Vacaciones 🏖️',
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'X-MICROSOFT-CDO-BUSYSTATUS:OOF',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function buildGCalUrlOpportunity(r: VacationWindow): string {
  const title = encodeURIComponent(`Vacaciones (${r.holidays.map(h => h.name).join(' + ')})`)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFmt(r.startDate)}/${dateFmt(r.endDate, 1)}`
}

export function buildGCalUrlPlanned(a: PeriodAnalysis): string {
  const title = encodeURIComponent('Vacaciones 🏖️')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFmt(a.period.startDate)}/${dateFmt(a.period.endDate, 1)}`
}

export function buildIcsOpportunity(r: VacationWindow): { content: string; filename: string } {
  return {
    content: buildIcs(r.id, r.startDate, r.endDate, r.vacationDaysRequired, r.holidays, r.totalDaysOff),
    filename: `vacaciones-${r.startDate}.ics`,
  }
}

export function buildIcsPlanned(a: PeriodAnalysis): { content: string; filename: string } {
  return {
    content: buildIcs(a.period.id, a.period.startDate, a.period.endDate, a.workdaysUsed, a.holidaysInside, a.totalDays),
    filename: `vacaciones-${a.period.startDate}.ics`,
  }
}

const APP_URL = 'https://www.vacaciones-chile.cl'

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
🎉 Descanso *${r.totalDaysOff} día${r.totalDaysOff !== 1 ? 's' : ''}* en total
⚡ Eficiencia: *${r.efficiency}x*

Feriados incluidos:
${holidays}

Planifica las tuyas en 👇
${APP_URL}`
}

export function buildShareTextPlanned(analysis: PeriodAnalysis): string {
  const holidays    = analysis.holidaysInside.map(h => `• ${h.name}`).join('\n')
  const hasHolidays = analysis.holidaysInside.length > 0
  const freeDays    = analysis.totalDays - analysis.workdaysUsed

  return `🏖️ *Mis vacaciones planificadas* 🏖️

📅 ${formatShortDate(analysis.period.startDate)} → ${formatShortDate(analysis.period.endDate)}

✅ Uso *${analysis.workdaysUsed} día${analysis.workdaysUsed !== 1 ? 's' : ''} de vacaciones*
🎉 Descanso *${analysis.totalDays} día${analysis.totalDays !== 1 ? 's' : ''}* en total
😴 *${freeDays} día${freeDays !== 1 ? 's' : ''} gratis* (feriados + fines de semana)
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