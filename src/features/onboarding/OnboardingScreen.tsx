import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { useHolidays } from '../../hooks/useHolidays'
import { buildYearCalendar } from '../../services/calendarService'
import { analyzeAllPeriods, totalWorkdaysUsed } from '../../services/plannerService'
import { Button } from '../../components/ui'
import { RegionSelector } from './RegionSelector'
import { DaysSelector } from './DaysSelector'
import { YearSelector } from './YearSelector'
import { PeriodPicker } from './PeriodPicker'
import type { PlannedPeriod } from '../../types/user.types'
import styles from './OnboardingScreen.module.css'

type Step = 'region' | 'days' | 'periods'
const STEPS: Step[] = ['region', 'days', 'periods']

export function OnboardingScreen() {
  const { preferences, confirmConfiguration } = useUserPreferences()

  const [localRegion,  setLocalRegion]  = useState(preferences.region)
  const [localDays,    setLocalDays]    = useState(preferences.availableDays)
  const [localYear,    setLocalYear]    = useState(preferences.year)
  const [localPeriods, setLocalPeriods] = useState<PlannedPeriod[]>(preferences.plannedPeriods)
  const [currentStep,  setCurrentStep]  = useState<Step>('region')

  const stepIndex = STEPS.indexOf(currentStep)
  const isLastStep = currentStep === 'periods'

  // Construimos el calendario para el PeriodPicker
  const holidays    = useHolidays(localYear, localRegion)
  const calendarDays = buildYearCalendar(localYear, holidays)
  const analyses    = analyzeAllPeriods(localPeriods, calendarDays)
  const usedDays    = totalWorkdaysUsed(analyses)

function handleNext() {
  if (currentStep === 'region') setCurrentStep('days')
  else if (currentStep === 'days') setCurrentStep('periods')
}

function handleBack() {
  if (currentStep === 'days')    setCurrentStep('region')
  else if (currentStep === 'periods') setCurrentStep('days')
}

  function handleAddPeriod(period: PlannedPeriod) {
    setLocalPeriods(prev => [...prev, period])
  }

  function handleRemovePeriod(id: string) {
    setLocalPeriods(prev => prev.filter(p => p.id !== id))
  }

  function handleConfirm() {
    confirmConfiguration({
      region: localRegion,
      availableDays: localDays,
      year: localYear,
      plannedPeriods: localPeriods,
    })
  }

  const STEP_TITLES: Record<Step, string> = {
    region:  '¿En qué región trabajas?',
    days:    '¿Cuántos días tienes disponibles?',
    periods: '¿Cuándo planeas tomar vacaciones?',
  }

  return (
    <div className={`${styles.screen} animate-fade-in`}>
      <div className={styles.header}>
        <span className={styles.logo}>
          {/* FlagCL ya lo tienes */}
        </span>
        <h1 className={styles.title}>Vacaciones Chile</h1>
        <p className={styles.subtitle}>Aprovecha los feriados al máximo</p>
      </div>

      <div className={styles.progress}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`${styles.dot} ${i <= stepIndex ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      <div className={styles.content}>
        {currentStep === 'region' && (
          <RegionSelector value={localRegion} onChange={setLocalRegion} />
        )}
        {currentStep === 'days' && (
          <DaysSelector value={localDays} onChange={setLocalDays} />
        )}
        {currentStep === 'periods' && (
          <div className={styles.periodStep}>
            <h2 className={styles.periodTitle}>{STEP_TITLES.periods}</h2>
            <p className={styles.periodSubtitle}>
              Opcional — puedes saltarte este paso si aún no lo sabes
            </p>
            <PeriodPicker
              calendarDays={calendarDays}
              periods={localPeriods}
              onAddPeriod={handleAddPeriod}
              onRemovePeriod={handleRemovePeriod}
              availableDays={localDays}
              usedDays={usedDays}
            />
          </div>
        )}
      </div>

      <div className={styles.nav}>
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={handleBack}>← Atrás</Button>
        )}
        <div className={styles.navRight}>
          {isLastStep ? (
            <div className={styles.lastStepBtns}>
              <Button variant="ghost" onClick={handleConfirm}>
                Saltar →
              </Button>
              <Button variant="primary" size="lg" onClick={handleConfirm}>
                Ver mis vacaciones →
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleNext}>Siguiente →</Button>
          )}
        </div>
      </div>
    </div>
  )
}