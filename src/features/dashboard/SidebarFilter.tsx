import type { RecommendationTier } from '../../types/recommendation.types'
import { TierInfoButton } from '../../components/ui'
import styles from './SidebarFilter.module.css'

type FilterTab = 'todas' | RecommendationTier

interface FilterOption {
  value: FilterTab
  label: string
  count: number
  color?: string
}

interface SidebarFilterProps {
  active: FilterTab
  onChange: (value: FilterTab) => void
  counts: {
    todas: number
    gratis: number
    oro: number
    plata: number
    bronce: number
  }
}

export function SidebarFilter({ active, onChange, counts }: SidebarFilterProps) {
  const options: FilterOption[] = [
    { value: 'todas',  label: 'Todas las oportunidades', count: counts.todas },
    { value: 'gratis', label: '🎁 Gratis',  count: counts.gratis },
    { value: 'oro',    label: '🥇 Oro',     count: counts.oro },
    { value: 'plata',  label: '🥈 Plata',   count: counts.plata },
    { value: 'bronce', label: '🥉 Bronce',  count: counts.bronce },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Por medalla</span>
        <TierInfoButton />
      </div>
    <nav className={styles.nav} aria-label="Filtrar por tier">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`${styles.option} ${active === opt.value ? styles.active : ''} ${opt.value !== 'todas' ? styles[opt.value] : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <span className={styles.label}>{opt.label}</span>
          <span className={`${styles.count} ${active === opt.value ? styles.countActive : ''}`}>
            {opt.count}
          </span>
        </button>
      ))}
    </nav>
    </div>
  )
}