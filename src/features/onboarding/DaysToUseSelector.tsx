import { useState } from 'react'
import styles from './DaysToUseSelector.module.css'

interface DaysToUseSelectorProps {
  value: number
  totalAvailable: number
  onChange: (days: number) => void
  onValidityChange?: (valid: boolean) => void
}

export function DaysToUseSelector({
  value,
  totalAvailable,
  onChange,
  onValidityChange,
}: DaysToUseSelectorProps) {
  const [inputStr, setInputStr] = useState(String(value))

  function parseInput(str: string): number | null {
    const n = parseInt(str, 10)
    return isNaN(n) ? null : n
  }

  function isValid(str: string): boolean {
    const n = parseInput(str)
    return n !== null && n >= 1 && n <= totalAvailable
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setInputStr(raw)
    const valid = isValid(raw)
    onValidityChange?.(valid)
    if (valid) onChange(parseInt(raw, 10))
  }

  function handleInputBlur() {
    const n = parseInput(inputStr)
    if (n === null || n < 1) {
      setInputStr(String(value))
      onValidityChange?.(true)
    } else if (n > totalAvailable) {
      onChange(totalAvailable)
      setInputStr(String(totalAvailable))
      onValidityChange?.(true)
    }
  }

  function handleQuickSelect(days: number) {
    onChange(days)
    setInputStr(String(days))
    onValidityChange?.(true)
  }

  function handleStepper(days: number) {
    onChange(days)
    setInputStr(String(days))
    onValidityChange?.(true)
  }

  const showWarning = !isValid(inputStr)

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
              className={`${styles.option} ${value === opt.value && !showWarning ? styles.selected : ''}`}
              onClick={() => handleQuickSelect(opt.value)}
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
            onClick={() => handleStepper(Math.max(1, value - 1))}
            type="button"
          >−</button>
          <input
            type="number"
            className={`${styles.input} ${showWarning ? styles.inputError : ''}`}
            value={inputStr}
            min={1}
            max={totalAvailable}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
          <button
            className={styles.stepper}
            onClick={() => handleStepper(Math.min(totalAvailable, value + 1))}
            type="button"
          >+</button>
        </div>
        {showWarning && (
          <p className={styles.warning}>Ingresa al menos 1 día</p>
        )}
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
