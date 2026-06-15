import styles from './Tabs.module.css'

interface Tab<T extends string> {
  value: T
  label: string
  count?: number
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (value: T) => void
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs} role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            className={`${styles.tab} ${active === tab.value ? styles.active : ''}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`${styles.count} ${active === tab.value ? styles.countActive : ''}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}