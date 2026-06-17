import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { Button } from '../../components/ui'
import { RegionSelector } from './RegionSelector'
import { DaysSelector } from './DaysSelector'
import { FlagCL } from '../../assets/FlagCL'
import styles from './OnboardingScreen.module.css'

type Step = 'region' | 'days'
const STEPS: Step[] = ['region', 'days']

export function OnboardingScreen() {
  const { preferences, confirmConfiguration } = useUserPreferences()

  const [localRegion, setLocalRegion] = useState(preferences.region)
  const [localDays,   setLocalDays]   = useState(preferences.availableDays)
  const [currentStep, setCurrentStep] = useState<Step>('region')

  const stepIndex  = STEPS.indexOf(currentStep)
  const isLastStep = currentStep === 'days'

  function handleNext() {
    if (currentStep === 'region') setCurrentStep('days')
  }

  function handleBack() {
    if (currentStep === 'days') setCurrentStep('region')
  }

  function handleConfirm() {
    confirmConfiguration({
      region:         localRegion,
      availableDays:  localDays,
      year:           new Date().getFullYear(),
      plannedPeriods: [],
    })
  }

  return (
    <div className={`${styles.screen} animate-fade-in`}>
      <div className={styles.header}>
        <span className={styles.logo}>
          <FlagCL size={64} />
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
      </div>

      <div className={styles.nav}>
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={handleBack}>← Atrás</Button>
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