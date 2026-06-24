import { useState, useRef, useEffect } from 'react'
import { copyToClipboard, shareToWhatsApp } from '../../services/shareService'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  getText: () => string
  compact?: boolean
  gcalUrl?: string
  getIcs?: () => { content: string; filename: string }
}

function triggerDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ShareButton({ getText, compact = false, gcalUrl, getIcs }: ShareButtonProps) {
  const [state, setState]       = useState<'idle' | 'open' | 'copied'>('idle')
  const [showHint, setShowHint] = useState(false)
  const menuRef                 = useRef<HTMLDivElement>(null)
  const btnRef                  = useRef<HTMLButtonElement>(null)

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

  async function handleIcs() {
    if (!getIcs) return
    setState('idle')
    const { content, filename } = getIcs()
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS && navigator.canShare) {
      const file = new File([content], filename, { type: 'text/calendar' })
      if (navigator.canShare({ files: [file] })) {
        setShowHint(true)
        await new Promise<void>(resolve => setTimeout(resolve, 500))
        try {
          await navigator.share({ files: [file] })
        } catch {
          // cancelled or failed — fall through to download
          triggerDownload(content, filename)
        }
        setShowHint(false)
        return
      }
    }
    triggerDownload(content, filename)
  }

  const hasCalendarOptions = !!(gcalUrl || getIcs)

  return (
    <>
      {showHint && (
        <div className={styles.iosHint}>
          En el menú que aparece, desliza las apps hacia la derecha y toca &ldquo;Calendario&rdquo; para agregarlo
        </div>
      )}
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

        {state === 'open' && (
          <div ref={menuRef} className={styles.popover}>
            {gcalUrl && (
              <a
                className={styles.menuItem}
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setState('idle')}
              >
                <span>📅</span>
                <span>Google Calendar</span>
              </a>
            )}
            {getIcs && (
              <button className={styles.menuItem} onClick={handleIcs}>
                <span>🍎</span>
                <span>Apple Calendar</span>
              </button>
            )}
            {hasCalendarOptions && <div className={styles.divider} />}
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
    </>
  )
}
