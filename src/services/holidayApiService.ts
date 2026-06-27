import type { Holiday } from '../types/holiday.types'
import { HOLIDAYS_2026 } from '../data/holidays/2026'
import { HOLIDAYS_2027 } from '../data/holidays/2027'

const API_BASE = 'https://api.boostr.cl'

// Datos de fallback si la API falla
const FALLBACK: Record<number, Holiday[]> = {
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
  const typeStr = h.type.toLowerCase()
  const type: Holiday['type'] = h.inalienable ? 'irrenunciable' : 'nacional'

  let category: Holiday['category']
  if (typeStr.includes('religioso')) {
    category = 'religioso'
  } else if (typeStr.includes('laboral') || typeStr.includes('trabajo')) {
    category = 'laboral'
  } else {
    category = 'civico'
  }

  // Día del Trabajo es irrenunciable de categoría laboral
  if (h.inalienable && (h.title.toLowerCase().includes('trabajo') || h.title.toLowerCase().includes('trabajador'))) {
    category = 'laboral'
  }

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

    if (json.status !== 'success' || !Array.isArray(json.data)) {
      throw new Error('Formato de respuesta inesperado')
    }

    const apiHolidays = json.data.map(mapBoostrHoliday)

    // Agregar feriados regionales del fallback que la API nacional no incluye
    const fallbackRegionales = (FALLBACK[year] ?? []).filter(h => h.type === 'regional')
    return [...apiHolidays, ...fallbackRegionales]
  } catch (error) {
    console.warn(`[HolidayAPI] Falló para ${year}, usando fallback:`, error)
    return FALLBACK[year] ?? []
  }
}