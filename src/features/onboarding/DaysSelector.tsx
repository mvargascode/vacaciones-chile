import styles from './DaysSelector.module.css'

interface DaysSelectorProps {
  value: number
  onChange: (days: number) => void
}

// Opciones predefinidas más comunes en Chile
const DAY_OPTIONS = [5, 10, 15, 20, 25, 30]

export function DaysSelector({ value, onChange }: DaysSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        ¿Cuántos días de vacaciones tienes disponibles?
      </label>

      <div className={styles.options}>
        {DAY_OPTIONS.map(days => (
          <button
            key={days}
            className={`${styles.option} ${value === days ? styles.selected : ''}`}
            onClick={() => onChange(days)}
            type="button"
          >
            {days}
          </button>
        ))}
      </div>

      <div className={styles.customContainer}>
        <label className={styles.customLabel}>O ingresa un número exacto:</label>
        <div className={styles.inputRow}>
          <button
            className={styles.stepper}
            onClick={() => onChange(Math.max(1, value - 1))}
            type="button"
            aria-label="Reducir días"
          >
            −
          </button>
          <input
            type="number"
            className={styles.input}
            value={value}
            min={1}
            max={60}
            onChange={e => {
              const val = parseInt(e.target.value)
              if (!isNaN(val) && val >= 1 && val <= 60) onChange(val)
            }}
          />
          <button
            className={styles.stepper}
            onClick={() => onChange(Math.min(60, value + 1))}
            type="button"
            aria-label="Aumentar días"
          >
            +
          </button>
        </div>
      </div>

      <p className={styles.hint}>
        En Chile, la ley establece 15 días hábiles mínimo de vacaciones al año.
      </p>
    </div>
  )
}