import { IconSettings } from '@tabler/icons-react'
import { FlagCL } from '../../assets/FlagCL'
import styles from './Header.module.css'

interface HeaderProps {
  title?: string
  subtitle?: string
  year?: number
  onSettingsClick?: () => void
}

export function Header({
  title = 'Vacaciones Chile',
  subtitle,
  year,
  onSettingsClick,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            <span className={styles.flag}><FlagCL size={22} /></span>
            {title}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.right}>
          {year && <span className={styles.year}>{year}</span>}
          {onSettingsClick && (
            <button
              className={styles.settingsBtn}
              onClick={onSettingsClick}
              aria-label="Configuración"
            >
              <IconSettings size={18} stroke={1.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
