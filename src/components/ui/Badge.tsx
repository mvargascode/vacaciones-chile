import styles from './Badge.module.css'

type BadgeVariant = 'oro' | 'plata' | 'bronce'

interface BadgeProps {
  variant: BadgeVariant
}

const LABELS: Record<BadgeVariant, string> = {
  oro:    '🥇 Oro',
  plata:  '🥈 Plata',
  bronce: '🥉 Bronce',
}

export function Badge({ variant }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {LABELS[variant]}
    </span>
  )
}