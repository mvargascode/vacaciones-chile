import { useIOSInstallBanner } from '../../hooks/useIOSInstallBanner'
import styles from './IOSInstallBanner.module.css'

export function IOSInstallBanner() {
  const { visible, dismiss } = useIOSInstallBanner()
  if (!visible) return null

  return (
    <div className={styles.banner} role="note" aria-label="Instrucciones para instalar la app">
      <p className={styles.message}>
        📱 Para instalar esta app en iPhone:<br />
        Toca ↑ Compartir → <strong>Añadir a pantalla de inicio</strong>
      </p>
      <button className={styles.closeBtn} onClick={dismiss} aria-label="Cerrar">
        ✕
      </button>
    </div>
  )
}
