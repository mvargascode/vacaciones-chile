export function FlagCL({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.667}
      viewBox="0 0 3 2"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bandera de Chile"
      role="img"
    >
      {/* Franja roja inferior */}
      <rect width="3" height="2" fill="#D52B1E"/>
      {/* Franja blanca superior derecha */}
      <rect width="2" height="1" x="1" fill="#FFFFFF"/>
      {/* Cuadrado azul superior izquierdo */}
      <rect width="1" height="1" fill="#0039A6"/>
      {/* Estrella blanca */}
      <polygon
        points="0.5,0.18 0.59,0.45 0.85,0.45 0.64,0.6 0.72,0.87 0.5,0.72 0.28,0.87 0.36,0.6 0.15,0.45 0.41,0.45"
        fill="#FFFFFF"
      />
    </svg>
  )
}