import styles from './Header.module.css'

interface HeaderProps {
  title?: string
  subtitle?: string
  onSettingsClick?: () => void
}

export function Header({
  title = 'Vacaciones Chile',
  subtitle,
  onSettingsClick,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>
              <span className={styles.flag}>🇨🇱</span>
              {title}
            </h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {onSettingsClick && (
            <button
              className={styles.settingsBtn}
              onClick={onSettingsClick}
              aria-label="Configuración"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>
    </header>
  )
}