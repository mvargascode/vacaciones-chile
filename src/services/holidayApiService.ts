import type { Holiday } from '../types/holiday.types'
import { HOLIDAYS_2025 } from '../data/holidays/2025'
import { HOLIDAYS_2026 } from '../data/holidays/2026'
import { HOLIDAYS_2027 } from '../data/holidays/2027'

const API_BASE = 'https://api.boostr.cl'

// Datos de fallback si la API falla
const FALLBACK: Record<number, Holiday[]> = {
  2025: HOLIDAYS_2025,
  2026: HOLIDAYS_2026,
  2027: HOLIDAYS_2027,
}
interface BoostrHoliday {
  date: string        // "2026-01-01"
  title: string       // "Año Nuevo"
  type: string        // "Irrenunciable" | "Civil" | "Religioso"
  inalienable: boolean
}

interface BoostrResponse {
  status: string
  data: BoostrHoliday[]
}

// Convierte el formato de Boostr al formato interno de la app
function mapBoostrHoliday(h: BoostrHoliday, index: number): Holiday {
  const type = h.inalienable ? 'irrenunciable' : 'nacional'
  const category = h.type.toLowerCase().includes('religioso')
    ? 'religioso'
    : h.type.toLowerCase().includes('civil') || h.type.toLowerCase().includes('cívico')
    ? 'civico'
    : h.type.toLowerCase().includes('irrenunciable')
    ? 'laboral'
    : 'civico'

  return {
    id: `${h.date}-${index}`,
    date: h.date,
    name: h.title,
    type,
    category,
    irrenunciable: h.inalienable,
  }
}

export async function fetchHolidaysFromApi(year: number): Promise<Holiday[]> {
  try {
    const url = `${API_BASE}/holidays/${year}.json`
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000), // timeout de 5 segundos
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const json: BoostrResponse = await response.json()

    if (json.status !== 'ok' || !Array.isArray(json.data)) {
      throw new Error('Formato de respuesta inesperado')
    }

    return json.data.map(mapBoostrHoliday)
  } catch (error) {
    console.warn(`[HolidayAPI] Falló para ${year}, usando fallback:`, error)
    return FALLBACK[year] ?? []
  }
}