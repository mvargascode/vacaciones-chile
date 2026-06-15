import styles from './Header.module.css'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = 'Vacaciones Chile', subtitle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.flag}>🇨🇱</span>
          {title}
        </h1>
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </div>
    </header>
  )
}