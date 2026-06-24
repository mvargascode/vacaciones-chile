import { IconSettings, IconSun, IconMoon } from '@tabler/icons-react'
import { FlagCL } from '../../assets/FlagCL'
import { useTheme } from '../../hooks/useTheme'
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
  const { theme, toggleTheme } = useTheme()

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
