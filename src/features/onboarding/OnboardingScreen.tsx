import { useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTheme } from '../../hooks/useTheme'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { Button } from '../../components/ui'
import { FlagCL } from '../../assets/FlagCL'
import { RegionSelector } from './RegionSelector'
import { SectorSelector } from './SectorSelector'
import { DaysSelector } from './DaysSelector'
import { DaysToUseSelector } from './DaysToUseSelector'
import { YearSelector } from './YearSelector'
import type { Sector } from '../../types/user.types'
import styles from './OnboardingScreen.module.css'

type Step = 'region' | 'sector' | 'totalDays' | 'daysToUse' | 'year'
const STEPS: Step[] = ['region', 'sector', 'totalDays', 'daysToUse', 'year']

export function OnboardingScreen() {
  const { theme, toggleTheme } = useTheme()
  const { preferences, confirmConfiguration } = useUserPreferences()

  const [localRegion,       setLocalRegion]       = useState(preferences.region)
  const [localSector,       setLocalSector]       = useState<Sector>(preferences.sector)
  const [localTotalDays,    setLocalTotalDays]    = useState(preferences.totalAvailableDays)
  const [localDaysToUse,    setLocalDaysToUse]    = useState(preferences.daysToUse)
  const [daysToUseValid,    setDaysToUseValid]    = useState(true)
  const [localYear,         setLocalYear]         = useState(preferences.year)
  const [currentStep,       setCurrentStep]       = useState<Step>('region')

  const stepIndex  = STEPS.indexOf(currentStep)
  const isLastStep = currentStep === 'year'

  // Cuando cambia el total, ajusta daysToUse si excede
  function handleTotalDaysChange(days: number) {
    setLocalTotalDays(days)
    if (localDaysToUse > days) setLocalDaysToUse(days)
  }

  function handleNext() {
    if (currentStep === 'region')    setCurrentStep('sector')
    else if (currentStep === 'sector')    setCurrentStep('totalDays')
    else if (currentStep === 'totalDays') setCurrentStep('daysToUse')
    else if (currentStep === 'daysToUse') setCurrentStep('year')
  }

  function handleBack() {
    if (currentStep === 'sector')    setCurrentStep('region')
    else if (currentStep === 'totalDays') setCurrentStep('sector')
    else if (currentStep === 'daysToUse') setCurrentStep('totalDays')
    else if (currentStep === 'year')      setCurrentStep('daysToUse')
  }

  function handleConfirm() {
    confirmConfiguration({
      region:             localRegion,
      sector:             localSector,
      totalAvailableDays: localTotalDays,
      daysToUse:          localDaysToUse,
      year:               localYear,
      plannedPeriods:     preferences.plannedPeriods,
    })
  }

  return (
    <main id="main-content" className={`${styles.screen} animate-fade-in`}>
      <button
        className={styles.themeBtn}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </button>
      <div className={styles.header}>
        <span className={styles.logo}>
          <FlagCL size={64} />
        </span>
        <h1 className={styles.title}>Vacaciones Chile</h1>
        <p className={styles.subtitle}>Aprovecha los feriados al máximo</p>
      </div>

      <div className={styles.progress} role="list" aria-label="Progreso del formulario">
        {STEPS.map((step, i) => (
          <div
            key={step}
            role="listitem"
            aria-label={`Paso ${i + 1} de ${STEPS.length}`}
            aria-current={i === stepIndex ? 'step' : undefined}
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
        {currentStep === 'totalDays' && (
          <DaysSelector
            value={localTotalDays}
            onChange={handleTotalDaysChange}
          />
        )}
        {currentStep === 'daysToUse' && (
          <DaysToUseSelector
            value={localDaysToUse}
            totalAvailable={localTotalDays}
            onChange={setLocalDaysToUse}
            onValidityChange={setDaysToUseValid}
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
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentStep === 'daysToUse' && !daysToUseValid}
            >
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}