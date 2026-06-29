export interface Region {
  code: string;
  name: string;
  shortName: string;
}

// Etiquetas en números romanos según la numeración oficial de regiones de Chile.
// RM se muestra sin numeración porque así se conoce popularmente.
const REGION_ROMAN_LABELS: Record<string, string> = {
  'XV': 'XV Región',
  '01': 'I Región',
  '02': 'II Región',
  '03': 'III Región',
  '04': 'IV Región',
  '05': 'V Región',
  'RM': 'RM',
  '06': 'VI Región',
  '07': 'VII Región',
  '08': 'VIII Región',
  '09': 'IX Región',
  '10': 'X Región',
  '11': 'XI Región',
  '12': 'XII Región',
  '14': 'XIV Región',
  '16': 'XVI Región',
}

export function getRegionLabel(code: string): string {
  return REGION_ROMAN_LABELS[code] ?? code
}

export const REGIONS: Region[] = [
  { code: "XV", name: "Arica y Parinacota", shortName: "Arica" },
  { code: "01", name: "Tarapacá", shortName: "Tarapacá" },
  { code: "02", name: "Antofagasta", shortName: "Antofagasta" },
  { code: "03", name: "Atacama", shortName: "Atacama" },
  { code: "04", name: "Coquimbo", shortName: "Coquimbo" },
  { code: "05", name: "Valparaíso", shortName: "Valparaíso" },
  { code: "RM", name: "Metropolitana de Santiago", shortName: "Santiago" },
  { code: "06", name: "O'Higgins", shortName: "O'Higgins" },
  { code: "07", name: "Maule", shortName: "Maule" },
  { code: "16", name: "Ñuble", shortName: "Ñuble" },
  { code: "08", name: "Biobío", shortName: "Biobío" },
  { code: "09", name: "La Araucanía", shortName: "Araucanía" },
  { code: "14", name: "Los Ríos", shortName: "Los Ríos" },
  { code: "10", name: "Los Lagos", shortName: "Los Lagos" },
  { code: "11", name: "Aysén", shortName: "Aysén" },
  { code: "12", name: "Magallanes", shortName: "Magallanes" },
];
