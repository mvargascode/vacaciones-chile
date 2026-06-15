import type { VacationWindow } from '../../types/recommendation.types'
import { PeriodCalendar } from '../../components/calendar'
import { Badge } from '../../components/ui'
import styles from './DetailScreen.module.css'

interface DetailScreenProps {
  recommendation: VacationWindow
  onBack: () => void
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function DetailScreen({ recommendation: r, onBack }: DetailScreenProps) {
  return (
    <div className="app-container animate-fade-in">
      {/* Header con back */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Volver">
          ← Volver
        </button>
        <Badge variant={r.tier} />
      </header>

      <main className={styles.main}>
        {/* Título del período */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            {r.holidays.map(h => h.name).join(' + ')}
          </h1>
          <p className={styles.dateRange}>
            {formatFullDate(r.startDate)} → {formatFullDate(r.endDate)}
          </p>
        </section>

        {/* Estadísticas principales */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{r.totalDaysOff}</span>
            <span className={styles.statLabel}>días libres totales</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{r.vacationDaysRequired}</span>
            <span className={styles.statLabel}>días de vacaciones</span>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statNumber} ${styles.efficiency}`}>
              {r.efficiency}x
            </span>
            <span className={styles.statLabel}>eficiencia</span>
          </div>
        </section>

        {/* Calendario del período */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Calendario del período</h2>
          <PeriodCalendar days={r.days} />
        </section>

        {/* Feriados incluidos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {r.holidays.length === 1 ? 'Feriado incluido' : 'Feriados incluidos'}
          </h2>
          <ul className={styles.holidayList}>
            {r.holidays.map(h => (
              <li key={h.id} className={styles.holidayItem}>
                <div className={styles.holidayIcon}>🗓️</div>
                <div className={styles.holidayInfo}>
                  <p className={styles.holidayName}>{h.name}</p>
                  <p className={styles.holidayDate}>
                    {formatFullDate(h.date)}
                  </p>
                </div>
                {h.irrenunciable && (
                  <span className={styles.irrenunciableBadge}>
                    Irrenunciable
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Desglose día a día */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Desglose</h2>
          <div className={styles.breakdown}>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Días corridos del período</span>
              <span className={styles.breakdownValue}>{r.totalDaysOff}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Feriados que caen dentro</span>
              <span className={styles.breakdownValue}>−{r.holidays.length}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Fines de semana dentro</span>
              <span className={styles.breakdownValue}>
                −{r.days.filter(d => d.dayType === 'fin_de_semana').length}
              </span>
            </div>
            <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
              <span className={styles.breakdownLabel}>Días de vacaciones a pedir</span>
              <span className={styles.breakdownValue}>{r.vacationDaysRequired}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}