import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import styles from './Page.module.css'

export function AcercaDe() {
  useTheme()

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <header className={styles.pageHeader}>
        <Link to="/" className={styles.backLink}>← Inicio</Link>
        <h1 className={styles.pageTitle}>Acerca de Vacaciones Chile</h1>
      </header>

      <main className={styles.pageContent}>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Qué es Vacaciones Chile?</h2>
          <p className={styles.sectionBody}>
            Vacaciones Chile es una herramienta gratuita que te ayuda a planificar
            tus días de vacaciones de forma inteligente, aprovechando al máximo
            los feriados nacionales y regionales de Chile.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Para qué sirve?</h2>
          <ul className={styles.list}>
            <li>Descubre las mejores oportunidades para descansar más días usando menos vacaciones</li>
            <li>Filtra por tu región y sector (privado, público o a honorarios)</li>
            <li>Usa el planificador para organizar tus períodos de vacaciones y ver cuántos días hábiles ocupas</li>
            <li>Las oportunidades se clasifican en Oro 🥇, Plata 🥈 y Bronce 🥉 según su eficiencia</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
          <p className={styles.sectionBody}>
            Los feriados se obtienen desde la API oficial de Boostr.cl, actualizada con los días
            festivos legales de Chile. El algoritmo calcula automáticamente los puentes y
            combinaciones más convenientes para cada feriado del año.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Quién lo hizo?</h2>
          <p className={styles.sectionBody}>
            Vacaciones Chile fue desarrollado por{' '}
            <a
              href="https://github.com/mvargascode"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
              style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
            >
              mvargascode
            </a>
            , desarrollador independiente basado en Santiago, Chile.
            Es un proyecto personal, open source y sin fines de lucro.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos del sitio</h2>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>Fuente de feriados</span>
              <span className={styles.dataValue}>API Boostr.cl + Biblioteca del Congreso</span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>Cobertura</span>
              <span className={styles.dataValue}>2026 y 2027</span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>Regiones</span>
              <span className={styles.dataValue}>Las 16 regiones de Chile</span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>Sectores</span>
              <span className={styles.dataValue}>Privado, Público y Honorarios</span>
            </div>
          </div>
        </section>

      </main>

      <footer className={styles.footer}>
        <Link to="/" className={styles.footerLink}>Inicio</Link>
        {' · '}
        <Link to="/contacto" className={styles.footerLink}>Contacto</Link>
        {' · Santiago, Chile · 2026'}
      </footer>
    </div>
  )
}
