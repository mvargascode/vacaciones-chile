import styles from './DaysToUseSelector.module.css'

interface DaysToUseSelectorProps {
  value: number
  totalAvailable: number
  onChange: (days: number) => void
}

export function DaysToUseSelector({ value, totalAvailable, onChange }: DaysToUseSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        ¿Cuántos días quieres usar este año?
      </label>
      <p className={styles.sublabel}>
        Tienes <strong>{totalAvailable} días</strong> disponibles en total. Puedes usar todos o guardar algunos para después.
      </p>

      {/* Opciones rápidas */}
      <div className={styles.options}>
        {[
          { label: 'Todos', value: totalAvailable },
          { label: 'La mitad', value: Math.floor(totalAvailable / 2) },
          { label: '5 días', value: 5 },
          { label: '10 días', value: 10 },
        ]
          .filter((opt, i, arr) =>
            opt.value > 0 &&
            opt.value <= totalAvailable &&
            arr.findIndex(o => o.value === opt.value) === i
          )
          .map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${value === opt.value ? styles.selected : ''}`}
              onClick={() => onChange(opt.value)}
            >
              <span className={styles.optionLabel}>{opt.label}</span>
              <span className={styles.optionValue}>{opt.value} días</span>
            </button>
          ))
        }
      </div>

      {/* Input manual */}
      <div className={styles.customContainer}>
        <label className={styles.customLabel}>O elige un número exacto:</label>
        <div className={styles.inputRow}>
          <button
            className={styles.stepper}
            onClick={() => onChange(Math.max(1, value - 1))}
            type="button"
          >−</button>
          <input
            type="number"
            className={styles.input}
            value={value}
            min={1}
            max={totalAvailable}
            onChange={e => {
              const raw = e.target.value
              if (raw === '') return
              const val = parseInt(raw)
              if (!isNaN(val) && val >= 1 && val <= totalAvailable) onChange(val)
            }}
            onBlur={e => {
              const val = parseInt(e.target.value)
              if (isNaN(val) || val < 1) onChange(1)
              if (val > totalAvailable) onChange(totalAvailable)
            }}
          />
          <button
            className={styles.stepper}
            onClick={() => onChange(Math.min(totalAvailable, value + 1))}
            type="button"
          >+</button>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(value / totalAvailable) * 100}%` }}
        />
      </div>
      <p className={styles.progressLabel}>
        Usando {value} de {totalAvailable} días disponibles
        {value < totalAvailable && (
          <span className={styles.remaining}> · Guardas {totalAvailable - value} para después</span>
        )}
      </p>
    </div>
  )
}