import type { Holiday } from '../../types/holiday.types'

// Fuente: Biblioteca del Congreso Nacional de Chile
// ⚠️ Fechas móviles a verificar:
// - Semana Santa 2027: 26 y 27 de marzo
// - Día Pueblos Indígenas 2027: 21 de junio (solsticio)
export const HOLIDAYS_2027: Holiday[] = [
  { id: '2027-01-01', date: '2027-01-01', name: 'Año Nuevo',                             type: 'irrenunciable', category: 'civico',    irrenunciable: true  },
  { id: '2027-03-26', date: '2027-03-26', name: 'Viernes Santo',                         type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-03-27', date: '2027-03-27', name: 'Sábado Santo',                          type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-05-01', date: '2027-05-01', name: 'Día del Trabajo',                       type: 'irrenunciable', category: 'laboral',   irrenunciable: true  },
  { id: '2027-05-21', date: '2027-05-21', name: 'Día de las Glorias Navales',            type: 'nacional',      category: 'civico',    irrenunciable: false },
  { id: '2027-06-21', date: '2027-06-21', name: 'Día Nacional de los Pueblos Indígenas', type: 'nacional',      category: 'civico',    irrenunciable: false },
  { id: '2027-06-29', date: '2027-06-29', name: 'San Pedro y San Pablo',                 type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-07-16', date: '2027-07-16', name: 'Virgen del Carmen',                     type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-08-15', date: '2027-08-15', name: 'Asunción de la Virgen',                 type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-09-18', date: '2027-09-18', name: 'Independencia Nacional',                type: 'irrenunciable', category: 'civico',    irrenunciable: true  },
  { id: '2027-09-19', date: '2027-09-19', name: 'Día de las Glorias del Ejército',       type: 'irrenunciable', category: 'civico',    irrenunciable: true  },
  { id: '2027-10-12', date: '2027-10-12', name: 'Encuentro de Dos Mundos',               type: 'nacional',      category: 'civico',    irrenunciable: false },
  { id: '2027-10-31', date: '2027-10-31', name: 'Día de las Iglesias Evangélicas y Protestantes', type: 'nacional', category: 'religioso', irrenunciable: false },
  { id: '2027-11-01', date: '2027-11-01', name: 'Día de Todos los Santos',               type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-12-08', date: '2027-12-08', name: 'Inmaculada Concepción',                 type: 'nacional',      category: 'religioso', irrenunciable: false },
  { id: '2027-12-25', date: '2027-12-25', name: 'Navidad',                               type: 'irrenunciable', category: 'religioso', irrenunciable: true  },
  // Ley 20.663 — solo Región de Arica y Parinacota
  { id: '2027-06-07-arica',  date: '2027-06-07', name: 'Asalto y Toma del Morro de Arica',            type: 'regional', category: 'civico', irrenunciable: false, regions: ['XV'] },
  // Ley 20.768 — solo comunas de Chillán y Chillán Viejo (región de Ñuble)
  { id: '2027-08-20-procer', date: '2027-08-20', name: 'Nacimiento del Prócer de la Independencia',   type: 'regional', category: 'civico', irrenunciable: false, regions: ['16'] },
]