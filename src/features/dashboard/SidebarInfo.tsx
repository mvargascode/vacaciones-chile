import { Button } from '../../components/ui'
import { REGIONS } from '../../data/regions'
import styles from './SidebarInfo.module.css'

interface SidebarInfoProps {
  region: string
  availableDays: number
  year: number
  totalRecommendations: number
  onReset: () => void
  fromApi: boolean   // ← agrega esto
}

export function SidebarInfo({
  region,
  availableDays,
  year,
  totalRecommendations,
  onReset,
  fromApi,   // ← agrega esto
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
          <span className={styles.configLabel}>Días disponibles</span>
          <span className={styles.configValue}>{availableDays} días</span>
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

      <Button variant="secondary" size="sm" fullWidth onClick={onReset}>
        ⚙️ Reconfigurar
      </Button>

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