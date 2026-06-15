import { getHolidaysForRegion } from './services/holidayService'
import { buildYearCalendar } from './services/calendarService'
import { generateRecommendations } from './services/recommendationService'

const TIER_COLORS: Record<string, string> = {
  oro:    'var(--color-oro-bg)',
  plata:  'var(--color-plata-bg)',
  bronce: 'var(--color-bronce-bg)',
}

function App() {
  const holidays        = getHolidaysForRegion(2025, 'RM')
  const calendar        = buildYearCalendar(2025, holidays)
  const recommendations = generateRecommendations(calendar, 10)

  return (
    <div className="app-container">
      <h1 style={{ padding: '1rem', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
        Vacaciones Chile 🇨🇱
      </h1>
      <p style={{ padding: '0 1rem 1rem', color: 'var(--color-text-secondary)' }}>
        {recommendations.length} oportunidades encontradas para 2025
      </p>
      <ul style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {recommendations.map(r => (
          <li
            key={r.id}
            style={{
              padding: 'var(--space-4)',
              background: TIER_COLORS[r.tier],
              borderRadius: 'var(--radius-md)',
              borderLeft: `4px solid var(--color-${r.tier})`,
            }}
          >
            <strong style={{ textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
              {r.tier}
            </strong>
            <p style={{ marginTop: 'var(--space-1)' }}>{r.description}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Eficiencia: {r.efficiency}x · {r.startDate} → {r.endDate}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App