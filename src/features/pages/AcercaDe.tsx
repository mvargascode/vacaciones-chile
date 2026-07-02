import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export function AcercaDe() {
  return (
    <div className={`${styles.page} animate-fade-in`}>

      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>← Inicio</Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.heroEmoji}>🏖️</span>
        <h1 className={styles.heroTitle}>Vacaciones Chile</h1>
        <p className={styles.heroSubtitle}>
          Planifica tus vacaciones aprovechando al máximo los feriados de Chile.
        </p>
      </div>

      <main className={styles.pageContent}>

        <div className={styles.cardsGrid}>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>¿Qué es?</h2>
            <p className={styles.cardBody}>
              Una herramienta gratuita que te ayuda a planificar tus días de vacaciones
              de forma inteligente, identificando los mejores momentos del año para descansar.
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>¿Cómo funciona?</h2>
            <p className={styles.cardBody}>
              Los feriados vienen de la API oficial de Boostr.cl. El algoritmo calcula
              automáticamente los puentes y combinaciones más convenientes para cada feriado.
            </p>
          </div>

          <div className={`${styles.card} ${styles.cardFull}`}>
            <h2 className={styles.cardTitle}>¿Para qué sirve?</h2>
            <ul className={styles.list}>
              <li>Descubre oportunidades para descansar más días usando menos vacaciones</li>
              <li>Filtra por tu región y sector (privado, público o a honorarios)</li>
              <li>Planifica tus períodos y ve exactamente cuántos días hábiles ocupas</li>
              <li>Las oportunidades se clasifican en Oro 🥇, Plata 🥈 y Bronce 🥉 según su eficiencia</li>
            </ul>
          </div>

          <div className={`${styles.card} ${styles.cardFull}`}>
            <h2 className={styles.cardTitle}>¿Quién lo hizo?</h2>
            <p className={styles.cardBody}>
              Desarrollado por{' '}
              <a
                href="https://github.com/mvargascode"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
              >
                mvargascode
              </a>
              , desarrollador independiente de Santiago, Chile.
              Es un proyecto personal, open source y sin fines de lucro.
            </p>
          </div>

        </div>

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

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLink}>Inicio</Link>
          <span className={styles.sep}>·</span>
          <Link to="/contacto" className={styles.footerLink}>Contacto</Link>
          <span className={styles.sep}>·</span>
          <span>Santiago, Chile · {new Date().getFullYear()}</span>
        </div>
      </footer>

    </div>
  )
}
