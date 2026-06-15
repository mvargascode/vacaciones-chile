export interface Region {
  code: string;
  name: string;
  shortName: string;
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
