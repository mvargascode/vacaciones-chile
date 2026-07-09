import { Link } from 'react-router-dom'
import { HOLIDAYS_2026 } from '../../data/holidays/2026'
import { HOLIDAYS_2027 } from '../../data/holidays/2027'
import type { Holiday } from '../../types/holiday.types'
import styles from './Page.module.css'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const label = date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatType(h: Holiday): string {
  if (h.irrenunciable) return 'Irrenunciable'
  if (h.type === 'regional') return 'Regional'
  return 'Nacional'
}

function HolidayTable({ year, holidays }: { year: number; holidays: Holiday[] }) {
  return (
    <div className={`${styles.card} ${styles.cardFull}`}>
      <h2 className={styles.cardTitle}>Feriados de Chile {year}</h2>
      <table className={styles.holidayTable}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Feriado</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h) => (
            <tr key={h.id}>
              <td>{formatDate(h.date)}</td>
              <td>{h.name}{h.regions ? ' *' : ''}</td>
              <td>{formatType(h)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.cardBody} style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-2)' }}>
        * Feriado regional, aplica solo en las comunas o regiones indicadas por ley.
      </p>
    </div>
  )
}

export function FeriadosChile() {
  return (
    <div className={`${styles.page} animate-fade-in`}>

      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>← Inicio</Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.heroEmoji}>📅</span>
        <h1 className={styles.heroTitle}>Feriados de Chile 2026 y 2027</h1>
        <p className={styles.heroSubtitle}>
          Lista completa y actualizada de los feriados nacionales, regionales e
          irrenunciables de Chile.
        </p>
      </div>

      <main className={styles.pageContent}>

        <HolidayTable year={2026} holidays={HOLIDAYS_2026} />
        <HolidayTable year={2027} holidays={HOLIDAYS_2027} />

        <div className={styles.cardsGrid}>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Feriados irrenunciables</h2>
            <p className={styles.cardBody}>
              La Ley 19.973 establece que ciertos feriados son irrenunciables para los
              trabajadores del comercio: nadie puede ser obligado a trabajar en Año Nuevo,
              1 de Mayo, 18 y 19 de septiembre, y Navidad, salvo excepciones específicas
              contempladas en la misma ley.
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Feriados móviles</h2>
            <p className={styles.cardBody}>
              La Ley 19.668 trasladó algunos feriados a los días lunes o viernes más
              cercanos para favorecer los fines de semana largos. San Pedro y San Pablo
              y el Día de las Iglesias Evangélicas y Protestantes son los feriados móviles
              vigentes actualmente.
            </p>
          </div>

          <div className={`${styles.card} ${styles.cardFull}`}>
            <h2 className={styles.cardTitle}>Feriado adicional de Fiestas Patrias</h2>
            <p className={styles.cardBody}>
              La Ley 20.983 agrega un feriado extra cuando el 18 de septiembre cae martes
              o miércoles, sumando el lunes previo o el viernes siguiente según corresponda,
              para formar un fin de semana largo. En 2027 este feriado adicional cae el
              viernes 17 de septiembre, extendiendo el descanso de Fiestas Patrias.
            </p>
          </div>

          <div className={`${styles.card} ${styles.cardFull}`}>
            <h2 className={styles.cardTitle}>Tips para aprovechar los feriados</h2>
            <ul className={styles.list}>
              <li>Combina un feriado que cae martes o jueves con un solo día de vacaciones para armar un fin de semana largo</li>
              <li>Revisa los feriados irrenunciables: si trabajas en el comercio, ya tienes esos días asegurados</li>
              <li>Usa el planificador para ver automáticamente las mejores combinaciones según tu región y sector</li>
            </ul>
          </div>

        </div>

        <p className={styles.cardBody} style={{ textAlign: 'center' }}>
          ¿Quieres ver cuántos días libres puedes obtener?{' '}
          <Link to="/" style={{ color: 'var(--color-primary)' }}>Prueba el planificador</Link>
        </p>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLink}>Inicio</Link>
          <span className={styles.sep}>·</span>
          <Link to="/acerca-de" className={styles.footerLink}>Acerca de</Link>
          <span className={styles.sep}>·</span>
          <Link to="/como-funciona" className={styles.footerLink}>Cómo funciona</Link>
          <span className={styles.sep}>·</span>
          <Link to="/contacto" className={styles.footerLink}>Contacto</Link>
          <span className={styles.sep}>·</span>
          <span>Santiago, Chile · {new Date().getFullYear()}</span>
        </div>
      </footer>

    </div>
  )
}
