import { useState } from 'react'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { Button } from '../../components/ui'
import { FlagCL } from '../../assets/FlagCL'
import { RegionSelector } from './RegionSelector'
import { SectorSelector } from './SectorSelector'
import { DaysSelector } from './DaysSelector'
import { YearSelector } from './YearSelector'
import type { Sector } from '../../types/user.types'
import styles from './OnboardingScreen.module.css'

type Step = 'region' | 'sector' | 'days' | 'year'
const STEPS: Step[] = ['region', 'sector', 'days', 'year']

export function OnboardingScreen() {
  const { preferences, confirmConfiguration } = useUserPreferences()

  const [localRegion, setLocalRegion] = useState(preferences.region)
  const [localSector, setLocalSector] = useState<Sector>(preferences.sector)
  const [localDays,   setLocalDays]   = useState(preferences.availableDays)
  const [localYear,   setLocalYear]   = useState(preferences.year)
  const [currentStep, setCurrentStep] = useState<Step>('region')

  const stepIndex  = STEPS.indexOf(currentStep)
  const isLastStep = currentStep === 'year'

  function handleNext() {
    if (currentStep === 'region') setCurrentStep('sector')
    else if (currentStep === 'sector') setCurrentStep('days')
    else if (currentStep === 'days') setCurrentStep('year')
  }

  function handleBack() {
    if (currentStep === 'sector') setCurrentStep('region')
    else if (currentStep === 'days') setCurrentStep('sector')
    else if (currentStep === 'year') setCurrentStep('days')
  }

  function handleConfirm() {
    confirmConfiguration({
      region:         localRegion,
      sector:         localSector,
      availableDays:  localDays,
      year:           localYear,
      plannedPeriods: preferences.plannedPeriods,
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
        {currentStep === 'sector' && (
          <SectorSelector value={localSector} onChange={setLocalSector} />
        )}
        {currentStep === 'days' && (
  <DaysSelector
    value={localDays}
    onChange={setLocalDays}
    sector={localSector}   // ← nuevo
  />
)}
        {currentStep === 'year' && (
          <YearSelector value={localYear} onChange={setLocalYear} />
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