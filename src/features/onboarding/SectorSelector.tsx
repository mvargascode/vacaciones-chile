import type { Sector } from '../../types/user.types'
import styles from './SectorSelector.module.css'

interface SectorSelectorProps {
  value: Sector
  onChange: (sector: Sector) => void
}

export function SectorSelector({ value, onChange }: SectorSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>¿En qué sector trabajas?</label>
      <p className={styles.sublabel}>
        Esto determina cómo se cuentan tus días hábiles.
      </p>

      <div className={styles.options}>
        <button
          type="button"
          className={`${styles.option} ${value === 'privado' ? styles.selected : ''}`}
          onClick={() => onChange('privado')}
        >
          <span className={styles.icon}>🏢</span>
          <div className={styles.optionInfo}>
            <span className={styles.optionTitle}>Sector Privado</span>
            <span className={styles.optionDesc}>
              Empresa, comercio, industria
            </span>
            <span className={styles.optionRule}>
              Vacaciones: lunes a sábado sin feriados
            </span>
          </div>
          {value === 'privado' && <span className={styles.check}>✓</span>}
        </button>

        <button
          type="button"
          className={`${styles.option} ${value === 'publico' ? styles.selected : ''}`}
          onClick={() => onChange('publico')}
        >
          <span className={styles.icon}>🏛️</span>
          <div className={styles.optionInfo}>
            <span className={styles.optionTitle}>Sector Público</span>
            <span className={styles.optionDesc}>
              Ministerios, municipios, servicios del Estado
            </span>
            <span className={styles.optionRule}>
              Vacaciones: lunes a viernes sin feriados
            </span>
          </div>
          {value === 'publico' && <span className={styles.check}>✓</span>}
        </button>

        <button
          type="button"
          className={`${styles.option} ${value === 'honorarios' ? styles.selected : ''}`}
          onClick={() => onChange('honorarios')}
        >
          <span className={styles.icon}>📄</span>
          <div className={styles.optionInfo}>
            <span className={styles.optionTitle}>Honorarios</span>
            <span className={styles.optionDesc}>
              Boleta de honorarios, independiente
            </span>
            <span className={styles.optionRule}>
              Sin vacaciones legales · igual que privado
            </span>
          </div>
          {value === 'honorarios' && <span className={styles.check}>✓</span>}
        </button>
      </div>

      <div className={styles.example}>
        <p className={styles.exampleTitle}>Ejemplo con jueves y viernes:</p>
        <div className={styles.exampleGrid}>
          <div className={styles.exampleCase}>
            <span className={styles.exampleLabel}>Privado</span>
            <span className={styles.exampleValue}>
              Jue + Vie + <strong>Sáb</strong> = 3 días hábiles usados
            </span>
          </div>
          <div className={styles.exampleCase}>
            <span className={styles.exampleLabel}>Público</span>
            <span className={styles.exampleValue}>
              Jue + Vie = 2 días hábiles usados
            </span>
          </div>
        </div>
        <p className={styles.exampleNote}>
          En ambos casos descansas 4 días (jue, vie, sáb, dom)
        </p>
      </div>
    </div>
  )
}