import { REGIONS, getRegionNumeral } from '../../data/regions'
import styles from './RegionSelector.module.css'

interface RegionSelectorProps {
  value: string
  onChange: (region: string) => void
}

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>¿En qué región trabajas?</label>
      <div className={styles.grid}>
        {REGIONS.map(region => (
          <button
            key={region.code}
            className={`${styles.option} ${value === region.code ? styles.selected : ''}`}
            onClick={() => onChange(region.code)}
            type="button"
          >
            <span className={styles.code}>{getRegionNumeral(region.code)}</span>
            <span className={styles.name}>{region.shortName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}