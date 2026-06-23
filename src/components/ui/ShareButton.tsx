import { useState } from 'react'
import { copyToClipboard, shareToWhatsApp } from '../../services/shareService'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  getText: () => string
  compact?: boolean
}

export function ShareButton({ getText, compact = false }: ShareButtonProps) {
  const [state, setState] = useState<'idle' | 'open' | 'copied'>('idle')

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

  if (state === 'copied') {
    return (
      <div className={`${styles.btn} ${styles.copied}`}>
        ✓ Copiado
      </div>
    )
  }

  if (state === 'open') {
    return (
      <div className={styles.menu}>
        <button className={styles.menuItem} onClick={handleWhatsApp}>
          <span>💬</span> Compartir por WhatsApp
        </button>
        <button className={styles.menuItem} onClick={handleCopy}>
          <span>📋</span> Copiar texto
        </button>
        <button
          className={`${styles.menuItem} ${styles.cancel}`}
          onClick={() => setState('idle')}
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      className={`${styles.btn} ${compact ? styles.compact : ''}`}
      onClick={() => setState('open')}
    >
      <span>📤</span>
      {!compact && ' Compartir'}
    </button>
  )
}