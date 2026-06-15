import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { Button } from '../../components/ui'
import { RegionSelector } from './RegionSelector'
import { DaysSelector } from './DaysSelector'
import { YearSelector } from './YearSelector'
import styles from './OnboardingScreen.module.css'

type Step = 'region' | 'days' | 'year'
const STEPS: Step[] = ['region', 'days', 'year']

export function OnboardingScreen() {
  const { preferences, confirmConfiguration } = useUserPreferences()

  // Estado local del onboarding — no guardamos hasta que el usuario confirme
  const [localRegion, setLocalRegion]   = useState(preferences.region)
  const [localDays, setLocalDays]       = useState(preferences.availableDays)
  const [localYear, setLocalYear]       = useState(preferences.year)
  const [currentStep, setCurrentStep]   = useState<Step>('region')

  const stepIndex = STEPS.indexOf(currentStep)
  const isLastStep = currentStep === 'year'

  function handleNext() {
    if (currentStep === 'region') setCurrentStep('days')
    else if (currentStep === 'days') setCurrentStep('year')
  }

  function handleBack() {
    if (currentStep === 'days') setCurrentStep('region')
    else if (currentStep === 'year') setCurrentStep('days')
  }

function handleConfirm() {
  confirmConfiguration({
    region: localRegion,
    availableDays: localDays,
    year: localYear,
  })
}

  return (
    <div className={`${styles.screen} animate-fade-in`}>
      <div className={styles.header}>
        <span className={styles.logo}>🇨🇱</span>
        <h1 className={styles.title}>Vacaciones Chile</h1>
        <p className={styles.subtitle}>Aprovecha los feriados al máximo</p>
      </div>

      {/* Indicador de progreso */}
      <div className={styles.progress}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`${styles.dot} ${i <= stepIndex ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* Contenido del paso actual */}
      <div className={styles.content}>
        {currentStep === 'region' && (
          <RegionSelector value={localRegion} onChange={setLocalRegion} />
        )}
        {currentStep === 'days' && (
          <DaysSelector value={localDays} onChange={setLocalDays} />
        )}
        {currentStep === 'year' && (
          <YearSelector value={localYear} onChange={setLocalYear} />
        )}
      </div>

      {/* Navegación */}
      <div className={styles.nav}>
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={handleBack}>
            ← Atrás
          </Button>
        )}
        <div className={styles.navRight}>
          {isLastStep ? (
            <Button variant="primary" size="lg" onClick={handleConfirm}>
              Ver mis vacaciones →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}