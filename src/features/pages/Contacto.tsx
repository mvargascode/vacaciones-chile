import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export function Contacto() {
  return (
    <div className={`${styles.page} animate-fade-in`}>

      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>← Inicio</Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.heroEmoji}>📧</span>
        <h1 className={styles.heroTitle}>Contacto</h1>
        <p className={styles.heroSubtitle}>
          ¿Tienes dudas, sugerencias o encontraste un error? Escríbenos.
        </p>
      </div>

      <main className={styles.pageContent}>

        <div className={styles.emailCard}>
          <div className={styles.emailCardHeader}>
            <span className={styles.emailIcon}>✉️</span>
            <h2 className={styles.emailCardTitle}>Escríbenos directamente</h2>
          </div>
          <a
            href="mailto:hola.vacacioneschile@gmail.com"
            className={styles.emailLink}
          >
            hola.vacacioneschile@gmail.com
          </a>
          <p className={styles.emailCardNote}>
            Leemos todos los mensajes y respondemos a la brevedad. Úsalo para reportar
            errores, sugerir funciones o contarnos cómo usas la aplicación.
          </p>
        </div>

        <div className={styles.cardsGrid}>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🐛 ¿Encontraste un error?</h2>
            <p className={styles.cardBody}>
              Si crees que hay un feriado incorrecto o faltante, escríbenos con
              la fecha, el nombre y la fuente oficial donde lo verificaste.
              Lo revisamos y corregimos rápidamente.
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>💡 ¿Tienes una sugerencia?</h2>
            <p className={styles.cardBody}>
              Todas las ideas son bienvenidas. Este proyecto crece gracias
              al feedback de sus usuarios. Cuéntanos qué mejorarías.
            </p>
          </div>

        </div>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLink}>Inicio</Link>
          <span className={styles.sep}>·</span>
          <Link to="/acerca-de" className={styles.footerLink}>Acerca de</Link>
          <span className={styles.sep}>·</span>
          <span>Santiago, Chile · 2026</span>
        </div>
      </footer>

    </div>
  )
}
