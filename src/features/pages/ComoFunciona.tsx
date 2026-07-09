import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import styles from './Page.module.css'
import tierStyles from './ComoFunciona.module.css'

const PAGE_TITLE = 'Cómo funciona Vacaciones Chile - Oro, Plata y Bronce'
const PAGE_DESCRIPTION = 'Descubre cómo funciona Vacaciones Chile y qué significan las medallas Oro, Plata, Bronce y Gratis para aprovechar al máximo los feriados de Chile.'

export function ComoFunciona() {
  useDocumentMeta(PAGE_TITLE, PAGE_DESCRIPTION)

  return (
    <div className={`${styles.page} animate-fade-in`}>

      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>← Inicio</Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.heroEmoji}>🏅</span>
        <h1 className={styles.heroTitle}>¿Cómo funciona Vacaciones Chile?</h1>
        <p className={styles.heroSubtitle}>
          Descubre cómo aprovechar los feriados al máximo.
        </p>
      </div>

      <main className={styles.pageContent}>

        <h2 className={tierStyles.sectionTitle}>Los 3 pasos</h2>
        <div className={styles.cardsGrid}>
          <div className={`${styles.card} ${styles.cardFull}`}>
            <h3 className={styles.cardTitle}>1️⃣ Ingresa tus días de vacaciones disponibles</h3>
          </div>
          <div className={`${styles.card} ${styles.cardFull}`}>
            <h3 className={styles.cardTitle}>2️⃣ La app analiza todos los feriados del año</h3>
          </div>
          <div className={`${styles.card} ${styles.cardFull}`}>
            <h3 className={styles.cardTitle}>3️⃣ Te muestra las mejores oportunidades para descansar más</h3>
          </div>
        </div>

        <h2 className={tierStyles.sectionTitle}>¿Qué significan las medallas?</h2>
        <div className={styles.cardsGrid}>
          <div className={`${styles.card} ${tierStyles.tierOro}`}>
            <h3 className={`${styles.cardTitle} ${tierStyles.tierOroTitle}`}>🥇 ORO — Máxima eficiencia</h3>
            <p className={styles.cardBody}>
              Gastas 1 día de vacaciones y descansas 4 o más. La mejor relación
              posible entre lo que usas y lo que descansas.
            </p>
          </div>

          <div className={`${styles.card} ${tierStyles.tierPlata}`}>
            <h3 className={`${styles.cardTitle} ${tierStyles.tierPlataTitle}`}>🥈 PLATA — Buena eficiencia</h3>
            <p className={styles.cardBody}>
              Gastas pocos días y descansas bastante. Por ejemplo, 4 días de
              vacación para 9 días libres seguidos.
            </p>
          </div>

          <div className={`${styles.card} ${tierStyles.tierBronce}`}>
            <h3 className={`${styles.cardTitle} ${tierStyles.tierBronceTitle}`}>🥉 BRONCE — Eficiencia normal</h3>
            <p className={styles.cardBody}>
              Aprovechas el feriado para extender tu descanso, aunque uses
              más días de vacación.
            </p>
          </div>

          <div className={`${styles.card} ${tierStyles.tierGratis}`}>
            <h3 className={`${styles.cardTitle} ${tierStyles.tierGratisTitle}`}>🆓 GRATIS — Sin gastar nada</h3>
            <p className={styles.cardBody}>
              Fin de semana largo donde el feriado cae viernes o lunes.
              Descansas 3 días sin usar ni un día de vacaciones.
            </p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardFull}`}>
          <h2 className={styles.cardTitle}>⚡ La fórmula</h2>
          <p className={styles.cardBody}>
            Eficiencia = días de descanso ÷ días de vacación usados
          </p>
          <p className={styles.cardBody}>
            Mientras más alta la eficiencia, mejor la oportunidad. Una
            oportunidad ORO tiene eficiencia de 4x o más, lo que significa
            que descansas 4 veces lo que gastas.
          </p>
        </div>

        <div className={`${styles.card} ${styles.cardFull}`}>
          <h2 className={styles.cardTitle}>🥇 Ejemplo: Virgen del Carmen 2026</h2>
          <p className={styles.cardBody}>
            El jueves 16 de julio es feriado. Si pides el viernes 17 de
            vacaciones (1 solo día), descansas jueves, viernes, sábado y
            domingo = 4 días libres. Eso es una oportunidad ORO de 4x
            eficiencia.
          </p>
        </div>

        <div className={tierStyles.ctaSection}>
          <Link to="/" className={tierStyles.ctaButton}>
            🏖️ Planificar mis vacaciones
          </Link>
        </div>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLink}>Inicio</Link>
          <span className={styles.sep}>·</span>
          <Link to="/acerca-de" className={styles.footerLink}>Acerca de</Link>
          <span className={styles.sep}>·</span>
          <Link to="/como-funciona" className={styles.footerLink}>Cómo funciona</Link>
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
