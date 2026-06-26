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
}

export function SidebarInfo({
  region,
  totalAvailableDays,
  daysToUse,
  year,
  sector,
  totalRecommendations,
  fromApi,
}: SidebarInfoProps) {
  const regionName = REGIONS.find(r => r.code === region)?.name ?? region

  return (
    <div className={styles.container}>
      <div className={styles.config}>
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Región</span>
          <span className={styles.configValue}>{regionName}</span>
        </div>
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Sector</span>
          <span className={styles.configValue}>
            {sector === 'publico' ? '🏛️ Público' : sector === 'honorarios' ? '📄 Honorarios' : '🏢 Privado'}
          </span>
        </div>
        <div className={styles.configRow}>
  <span className={styles.configLabel}>Días disponibles</span>
  <span className={styles.configValue}>{totalAvailableDays} días</span>
</div>
<div className={styles.configRow}>
  <span className={styles.configLabel}>Días a usar</span>
  <span className={styles.configValue}>{daysToUse} días</span>
</div>
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Año</span>
          <span className={styles.configValue}>{year}</span>
        </div>
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