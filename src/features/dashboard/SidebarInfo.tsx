import { useState, useRef, useEffect } from 'react'
import { REGIONS } from '../../data/regions'
import type { Sector } from '../../types/user.types'
import styles from './SidebarInfo.module.css'

interface SidebarInfoProps {
  region: string
  totalAvailableDays: number
  daysToUse: number
  year: number
  sector: Sector
  totalRecommendations: number
  fromApi: boolean
  onRegionChange: (region: string) => void
  onSectorChange: (sector: Sector) => void
  onTotalAvailableDaysChange: (days: number) => void
  onDaysToUseChange: (days: number) => void
  onYearChange: (year: number) => void
}

const SECTOR_LABELS: Record<Sector, string> = {
  privado:    '🏢 Privado',
  publico:    '🏛️ Público',
  honorarios: '📄 Honorarios',
}
const SECTOR_CYCLE: Sector[] = ['privado', 'publico', 'honorarios']

export function SidebarInfo({
  region,
  totalAvailableDays,
  daysToUse,
  year,
  sector,
  totalRecommendations,
  fromApi,
  onRegionChange,
  onSectorChange,
  onTotalAvailableDaysChange,
  onDaysToUseChange,
  onYearChange,
}: SidebarInfoProps) {
  const [regionOpen, setRegionOpen] = useState(false)
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!regionOpen) return
    function handleOutside(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [regionOpen])

  const currentShortName = REGIONS.find(r => r.code === region)?.shortName ?? region

  function cycleSector() {
    const idx = SECTOR_CYCLE.indexOf(sector)
    onSectorChange(SECTOR_CYCLE[(idx + 1) % SECTOR_CYCLE.length])
  }

  function changeTotalDays(delta: number) {
    const next = Math.min(30, Math.max(1, totalAvailableDays + delta))
    onTotalAvailableDaysChange(next)
    if (daysToUse > next) onDaysToUseChange(next)
  }

  function changeDaysToUse(delta: number) {
    onDaysToUseChange(Math.min(totalAvailableDays, Math.max(1, daysToUse + delta)))
  }

  return (
    <div className={styles.container}>
      <div className={styles.config}>

        {/* Región */}
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Región</span>
          <div className={styles.regionDropdownWrapper} ref={regionRef}>
            <button
              className={styles.regionTrigger}
              onClick={() => setRegionOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={regionOpen}
              aria-label="Seleccionar región"
            >
              <span className={styles.regionTriggerText}>{currentShortName}</span>
              <span
                className={`${styles.chevron} ${regionOpen ? styles.chevronOpen : ''}`}
                aria-hidden="true"
              >▾</span>
            </button>

            {regionOpen && (
              <ul
                className={styles.regionDropdownPanel}
                role="listbox"
                aria-label="Regiones disponibles"
              >
                {REGIONS.map(r => (
                  <li
                    key={r.code}
                    role="option"
                    aria-selected={r.code === region}
                    className={`${styles.regionOption} ${r.code === region ? styles.regionOptionActive : ''}`}
                    onMouseDown={() => {
                      onRegionChange(r.code)
                      setRegionOpen(false)
                    }}
                  >
                    {r.shortName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sector */}
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Sector</span>
          <button
            className={styles.sectorToggle}
            onClick={cycleSector}
            title="Clic para cambiar sector"
            aria-label={`Sector: ${SECTOR_LABELS[sector]}. Clic para cambiar.`}
          >
            {SECTOR_LABELS[sector]}
          </button>
        </div>

        {/* Días disponibles */}
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Días disponibles</span>
          <div className={styles.stepper}>
            <button
              className={styles.stepBtn}
              onClick={() => changeTotalDays(-1)}
              disabled={totalAvailableDays <= 1}
              aria-label="Reducir días disponibles"
            >−</button>
            <span className={styles.stepValue}>{totalAvailableDays}</span>
            <button
              className={styles.stepBtn}
              onClick={() => changeTotalDays(1)}
              disabled={totalAvailableDays >= 30}
              aria-label="Aumentar días disponibles"
            >+</button>
          </div>
        </div>

        {/* Días a usar */}
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Días a usar</span>
          <div className={styles.stepper}>
            <button
              className={styles.stepBtn}
              onClick={() => changeDaysToUse(-1)}
              disabled={daysToUse <= 1}
              aria-label="Reducir días a usar"
            >−</button>
            <span className={styles.stepValue}>{daysToUse}</span>
            <button
              className={styles.stepBtn}
              onClick={() => changeDaysToUse(1)}
              disabled={daysToUse >= totalAvailableDays}
              aria-label="Aumentar días a usar"
            >+</button>
          </div>
        </div>

        {/* Año */}
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Año</span>
          <div className={styles.yearToggle}>
            <button
              className={`${styles.yearBtn} ${year === 2026 ? styles.yearActive : ''}`}
              onClick={() => onYearChange(2026)}
            >2026</button>
            <button
              className={`${styles.yearBtn} ${year === 2027 ? styles.yearActive : ''}`}
              onClick={() => onYearChange(2027)}
            >2027</button>
          </div>
        </div>

        {/* Oportunidades (solo lectura) */}
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Oportunidades</span>
          <span className={styles.configValue}>{totalRecommendations} encontradas</span>
        </div>

      </div>

      <div className={styles.adSlot}>Publicidad · 160×160</div>

      <p style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        marginTop: 'var(--space-2)',
      }}>
        Datos: {fromApi ? '🟢 API oficial' : '🟡 Datos locales'}
      </p>
    </div>
  )
}
