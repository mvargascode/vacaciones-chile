import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './TierInfoButton.module.css'

const TIERS = [
  {
    medal:   '🥇',
    name:    'Oro',
    range:   'Eficiencia mayor a 3x',
    detail:  'Descansas 3 o más días por cada día de vacaciones usado.',
    cls:     styles.oro,
  },
  {
    medal:   '🥈',
    name:    'Plata',
    range:   'Eficiencia entre 2x y 3x',
    detail:  'Descansas entre 2 y 3 días por cada día de vacaciones usado.',
    cls:     styles.plata,
  },
  {
    medal:   '🥉',
    name:    'Bronce',
    range:   'Eficiencia entre 1x y 2x',
    detail:  'Descansas entre 1 y 2 días por cada día de vacaciones usado.',
    cls:     styles.bronce,
  },
]

export function TierInfoButton() {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="¿Qué significan las medallas?"
      >
        ?
      </button>

      {open && createPortal(
        <div
          className={styles.overlay}
          ref={overlayRef}
          onClick={e => { if (e.target === overlayRef.current) setOpen(false) }}
          aria-hidden="true"
        >
          <div
            className={styles.popup}
            role="dialog"
            aria-modal="true"
            aria-label="¿Qué significan las medallas?"
          >
            <div className={styles.header}>
              <h3 className={styles.title}>¿Qué significan las medallas?</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className={styles.body}>
              <p className={styles.intro}>
                La eficiencia mide cuántos días libres obtienes por cada día de vacaciones que usas, aprovechando feriados y fines de semana.
              </p>

              <div className={styles.tiers}>
                {TIERS.map(t => (
                  <div key={t.name} className={`${styles.tierRow} ${t.cls}`}>
                    <span className={styles.medal}>{t.medal}</span>
                    <div className={styles.tierInfo}>
                      <span className={styles.tierName}>{t.name}</span>
                      <span className={styles.tierRange}>{t.range}</span>
                      <span className={styles.tierDetail}>{t.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
