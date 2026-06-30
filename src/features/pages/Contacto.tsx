import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import styles from './Page.module.css'

export function Contacto() {
  useTheme()

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <header className={styles.pageHeader}>
        <Link to="/" className={styles.backLink}>← Inicio</Link>
        <h1 className={styles.pageTitle}>Contacto</h1>
      </header>

      <main className={styles.pageContent}>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Tienes dudas, sugerencias o encontraste un error?</h2>
          <p className={styles.sectionBody}>
            Nos encantaría saber de ti. Puedes escribirnos directamente a nuestro correo
            y te responderemos a la brevedad.
          </p>
          <div className={styles.contactCard}>
            <a
              href="mailto:hola.vacacioneschile@gmail.com"
              className={styles.emailLink}
            >
              📧 hola.vacacioneschile@gmail.com
            </a>
            <p className={styles.sectionBody} style={{ margin: 0 }}>
              También puedes escribirnos para reportar errores, sugerir nuevas funciones
              o simplemente contarnos cómo usas la aplicación.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Encontraste un error en un feriado?</h2>
          <p className={styles.sectionBody}>
            Si crees que hay un feriado incorrecto o faltante, escríbenos indicando
            la fecha, el nombre del feriado y la fuente oficial donde lo verificaste.
            Lo revisamos y corregimos rápidamente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Quieres sugerir una nueva función?</h2>
          <p className={styles.sectionBody}>
            Todas las sugerencias son bienvenidas. Este proyecto crece gracias
            al feedback de sus usuarios.
          </p>
        </section>

      </main>

      <footer className={styles.footer}>
        <Link to="/" className={styles.footerLink}>Inicio</Link>
        {' · '}
        <Link to="/acerca-de" className={styles.footerLink}>Acerca de</Link>
        {' · Santiago, Chile · 2026'}
      </footer>
    </div>
  )
}
