import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  accent?: 'oro' | 'plata' | 'bronce' | 'gratis'
}

export function Card({ children, onClick, accent }: CardProps) {
  const classes = [
    styles.card,
    accent ? styles[accent] : '',
    onClick ? styles.clickable : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  )
}