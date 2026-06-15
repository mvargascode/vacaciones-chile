import styles from './EmptyState.module.css'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
}

export function EmptyState({ emoji = '🔍', title, description }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <span className={styles.emoji}>{emoji}</span>
      <p className={styles.title}>{title}</p>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  )
}