import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Page.module.css'
import linkStyles from './Links.module.css'

const PAGE_TITLE = 'Vacaciones Chile — Links'
const PAGE_DESCRIPTION = 'Todos los enlaces de Vacaciones Chile: planifica tus vacaciones, revisa los feriados de Chile 2026 y 2027, y síguenos en Instagram.'

function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''

    document.title = title
    meta?.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
    }
  }, [title, description])
}

export function Links() {
  useDocumentMeta(PAGE_TITLE, PAGE_DESCRIPTION)

  return (
    <div className={`${styles.page} animate-fade-in`}>

      <div className={styles.hero}>
        <img src="/pwa-192x192.png" alt="Vacaciones Chile" className={styles.heroLogo} />
        <h1 className={styles.heroTitle}>Vacaciones Chile</h1>
        <p className={styles.heroSubtitle}>Aprovecha los feriados al máximo 🇨🇱</p>
      </div>

      <main className={styles.pageContent}>

        <nav className={linkStyles.linkList} aria-label="Enlaces de Vacaciones Chile">
          <Link to="/" className={linkStyles.linkButton}>
            <span className={linkStyles.linkIcon}>🏖️</span>
            <span className={linkStyles.linkLabel}>Planificar mis vacaciones</span>
          </Link>

          <Link to="/acerca-de" className={linkStyles.linkButton}>
            <span className={linkStyles.linkIcon}>🥇</span>
            <span className={linkStyles.linkLabel}>¿Qué son Oro, Plata y Bronce?</span>
          </Link>

          <Link to="/feriados-chile" className={linkStyles.linkButton}>
            <span className={linkStyles.linkIcon}>📅</span>
            <span className={linkStyles.linkLabel}>Feriados de Chile 2026 y 2027</span>
          </Link>

          <Link to="/acerca-de" className={linkStyles.linkButton}>
            <span className={linkStyles.linkIcon}>💡</span>
            <span className={linkStyles.linkLabel}>Sobre Vacaciones Chile</span>
          </Link>

          <Link to="/contacto" className={linkStyles.linkButton}>
            <span className={linkStyles.linkIcon}>📧</span>
            <span className={linkStyles.linkLabel}>Contacto</span>
          </Link>

          <a
            href="https://instagram.com/vacacioneschile.cl"
            target="_blank"
            rel="noopener noreferrer"
            className={linkStyles.linkButton}
          >
            <span className={linkStyles.linkIcon}>📸</span>
            <span className={linkStyles.linkLabel}>Síguenos en Instagram</span>
            <span className={linkStyles.linkExternal}>↗</span>
          </a>
        </nav>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLink}>Inicio</Link>
          <span className={styles.sep}>·</span>
          <Link to="/acerca-de" className={styles.footerLink}>Acerca de</Link>
          <span className={styles.sep}>·</span>
          <Link to="/feriados-chile" className={styles.footerLink}>Feriados</Link>
          <span className={styles.sep}>·</span>
          <Link to="/contacto" className={styles.footerLink}>Contacto</Link>
          <span className={styles.sep}>·</span>
          <span>Santiago, Chile · {new Date().getFullYear()}</span>
        </div>
      </footer>

    </div>
  )
}
