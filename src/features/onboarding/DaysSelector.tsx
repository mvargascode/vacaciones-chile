import { useState } from 'react'
import styles from './DaysSelector.module.css'

interface DaysSelectorProps {
  value: number
  onChange: (days: number) => void
  sector?: 'privado' | 'publico'
}

const DAY_OPTIONS = [5, 10, 15, 20, 25, 30]

function calculateLegalDays(years: number): number {
  if (years <= 10) return 15
  return 15 + Math.floor((years - 10) / 3)
}

export function DaysSelector({ value, onChange, sector }: DaysSelectorProps) {
  const [workYears, setWorkYears] = useState(1)

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

      {/* Calculadora legal — solo sector privado */}
      {sector === 'privado' && (
        <div className={styles.calculator}>
          <p className={styles.calculatorTitle}>
            🧮 Calculadora de días legales (sector privado)
          </p>
          <p className={styles.calculatorDesc}>
            ¿Cuántos años llevas en tu trabajo actual?
          </p>
          <div className={styles.yearsInput}>
            <button
              className={styles.stepper}
              onClick={() => {
                const years = Math.max(1, workYears - 1)
                setWorkYears(years)
                onChange(calculateLegalDays(years))
              }}
              type="button"
              aria-label="Reducir años"
            >
              −
            </button>
            <span className={styles.yearsValue}>
              {workYears} año{workYears !== 1 ? 's' : ''}
            </span>
            <button
              className={styles.stepper}
              onClick={() => {
                const years = Math.min(40, workYears + 1)
                setWorkYears(years)
                onChange(calculateLegalDays(years))
              }}
              type="button"
              aria-label="Aumentar años"
            >
              +
            </button>
          </div>
          <div className={styles.calculatorResult}>
            <p>
              15 días base
              {workYears > 10 && (
                <>
                  {' '}+ {Math.floor((workYears - 10) / 3)} día{Math.floor((workYears - 10) / 3) !== 1 ? 's' : ''} adicional{Math.floor((workYears - 10) / 3) !== 1 ? 'es' : ''} por antigüedad
                </>
              )}
              {' '}= <strong>{calculateLegalDays(workYears)} días</strong>
            </p>
          </div>
          <button
            className={styles.applyCalc}
            type="button"
            onClick={() => onChange(calculateLegalDays(workYears))}
          >
            Usar este valor →
          </button>
        </div>
      )}
    </div>
  )
}