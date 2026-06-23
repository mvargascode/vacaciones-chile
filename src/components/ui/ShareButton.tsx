import { useState, useRef, useEffect } from 'react'
import { copyToClipboard, shareToWhatsApp } from '../../services/shareService'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  getText: () => string
  compact?: boolean
}

export function ShareButton({ getText, compact = false }: ShareButtonProps) {
  const [state, setState]   = useState<'idle' | 'open' | 'copied'>('idle')
  const menuRef             = useRef<HTMLDivElement>(null)
  const btnRef              = useRef<HTMLButtonElement>(null)

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    if (state !== 'open') return
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setState('idle')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [state])

  function handleCopy() {
    copyToClipboard(getText()).then(() => {
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
    })
  }

  function handleWhatsApp() {
    shareToWhatsApp(getText())
    setState('idle')
  }

  return (
    <div className={styles.wrapper}>
      {state === 'copied' ? (
        <div className={`${styles.btn} ${styles.copied}`}>
          ✓ Copiado
        </div>
      ) : (
        <button
          ref={btnRef}
          className={`${styles.btn} ${compact ? styles.compact : ''} ${state === 'open' ? styles.active : ''}`}
          onClick={() => setState(state === 'open' ? 'idle' : 'open')}
          aria-label="Compartir"
        >
          <span>📤</span>
          {!compact && ' Compartir'}
        </button>
      )}

      {/* Menú flotante */}
      {state === 'open' && (
        <div ref={menuRef} className={styles.popover}>
          <button className={styles.menuItem} onClick={handleWhatsApp}>
            <span>💬</span>
            <span>Compartir por WhatsApp</span>
          </button>
          <div className={styles.divider} />
          <button className={styles.menuItem} onClick={handleCopy}>
            <span>📋</span>
            <span>Copiar texto</span>
          </button>
        </div>
      )}
    </div>
  )
}