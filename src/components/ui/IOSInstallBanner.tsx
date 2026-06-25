import { useIOSInstallBanner } from '../../hooks/useIOSInstallBanner'
import styles from './IOSInstallBanner.module.css'

export function IOSInstallBanner() {
  const { visible, isSafari, dismiss } = useIOSInstallBanner()
  if (!visible) return null

  return (
    <div className={styles.banner} role="note" aria-label="Instrucciones para instalar la app">
      <p className={styles.message}>
        {isSafari
          ? <>📱 Instala esta app: toca ↑ y elige <strong>«Agregar a Inicio»</strong></>
          : <>🌐 Para instalar: ábrelo en Safari, toca ↑ y elige <strong>«Agregar a Inicio»</strong></>
        }
      </p>
      <button className={styles.closeBtn} onClick={dismiss} aria-label="Cerrar">
        ✕
      </button>
    </div>
  )
}
