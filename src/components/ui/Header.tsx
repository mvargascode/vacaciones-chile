import { IconSun, IconMoon, IconDownload } from '@tabler/icons-react'
import { useTheme } from '../../hooks/useTheme'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import styles from './Header.module.css'

interface HeaderProps {
  title?: string
  subtitle?: string
  year?: number
  onBack?: () => void
}

export function Header({
  title = 'Vacaciones Chile',
  subtitle,
  year,
  onBack,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { canInstall, triggerInstall } = useInstallPrompt()

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            <img src="/pwa-192x192.png" alt="" aria-hidden="true" className={styles.flag} />
            {title}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.right}>
          {year && <span className={styles.year}>{year}</span>}
          {canInstall && (
            <button
              className={styles.installBtn}
              onClick={triggerInstall}
              aria-label="Instalar aplicación"
            >
              <IconDownload size={14} stroke={1.5} />
              Instalar
            </button>
          )}
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark'
              ? <IconSun size={16} stroke={1.5} />
              : <IconMoon size={16} stroke={1.5} />
            }
          </button>
          {onBack && (
            <button
              className={styles.backBtn}
              onClick={onBack}
              aria-label="Volver a configuración"
            >
              ← Atrás
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
