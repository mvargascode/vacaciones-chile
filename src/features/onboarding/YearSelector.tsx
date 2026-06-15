import styles from './YearSelector.module.css'

interface YearSelectorProps {
  value: number
  onChange: (year: number) => void
}

const AVAILABLE_YEARS = [2025, 2026]

export function YearSelector({ value, onChange }: YearSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>¿Qué año quieres planificar?</label>
      <div className={styles.options}>
        {AVAILABLE_YEARS.map(year => (
          <button
            key={year}
            className={`${styles.option} ${value === year ? styles.selected : ''}`}
            onClick={() => onChange(year)}
            type="button"
          >
            <span className={styles.year}>{year}</span>
            {year === new Date().getFullYear() && (
              <span className={styles.tag}>Este año</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}