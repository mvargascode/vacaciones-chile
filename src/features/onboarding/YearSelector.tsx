import styles from './YearSelector.module.css'

interface YearSelectorProps {
  value: number
  onChange: (year: number) => void
}

const AVAILABLE_YEARS = [2026, 2027]

export function YearSelector({ value, onChange }: YearSelectorProps) {
  const currentYear = new Date().getFullYear()

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
            {year === currentYear && (
              <span className={styles.tag}>Este año</span>
            )}
            {year === currentYear + 1 && (
              <span className={styles.tag}>Próximo año</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}