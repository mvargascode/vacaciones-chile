import type { ReactNode } from 'react'
import styles from './Sidebar.module.css'

interface SidebarProps {
  children: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      {children}
    </aside>
  )
}

interface SidebarSectionProps {
  title?: string
  children: ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className={styles.section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {children}
    </div>
  )
}