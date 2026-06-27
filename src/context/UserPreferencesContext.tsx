import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UserPreferences, PlannedPeriod, Sector } from '../types/user.types'

const DEFAULT_PREFERENCES: UserPreferences = {
  region:             'RM',
  totalAvailableDays: 15,
  daysToUse:          15,
  year:               new Date().getFullYear(),
  plannedPeriods:     [],
  sector:             'privado',
}

const STORAGE_KEY = 'vacaciones-chile:preferences'

function loadPreferences(): { preferences: UserPreferences; isConfigured: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return {
        preferences: { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) },
        isConfigured: true,
      }
    }
  } catch {}
  return { preferences: DEFAULT_PREFERENCES, isConfigured: false }
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  setRegion: (region: string) => void
  setTotalAvailableDays: (days: number) => void
  setDaysToUse: (days: number) => void
  setYear: (year: number) => void
  setSector: (sector: Sector) => void
  isConfigured: boolean
  onboardingReturnStep: string | null
  confirmConfiguration: (prefs: UserPreferences) => void
  resetConfiguration: () => void
  goBackToOnboarding: () => void
  clearReturnStep: () => void
  addPlannedPeriod: (period: PlannedPeriod) => void
  removePlannedPeriod: (id: string) => void
  updatePlannedPeriod: (id: string, startDate: string, endDate: string) => void
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const loaded = loadPreferences()
  const [preferences, setPreferences] = useState<UserPreferences>(loaded.preferences)
  const [isConfigured, setIsConfigured] = useState<boolean>(loaded.isConfigured)
  const [onboardingReturnStep, setOnboardingReturnStep] = useState<string | null>(null)

  useEffect(() => {
    if (isConfigured) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    }
  }, [preferences, isConfigured])

  function setRegion(region: string) {
    setPreferences(prev => ({ ...prev, region }))
  }

  function setTotalAvailableDays(totalAvailableDays: number) {
    setPreferences(prev => ({ ...prev, totalAvailableDays }))
  }

  function setDaysToUse(daysToUse: number) {
    setPreferences(prev => ({ ...prev, daysToUse }))
  }

  function setYear(year: number) {
    setPreferences(prev => ({ ...prev, year }))
  }

  function setSector(sector: Sector) {
    setPreferences(prev => ({ ...prev, sector }))
  }

  function confirmConfiguration(prefs: UserPreferences) {
    setPreferences(prefs)
    setIsConfigured(true)
  }

  function resetConfiguration() {
    localStorage.removeItem(STORAGE_KEY)
    setPreferences(DEFAULT_PREFERENCES)
    setIsConfigured(false)
  }

  // Vuelve al onboarding sin borrar preferencias ni localStorage,
  // posicionando al usuario en el último paso (year)
  function goBackToOnboarding() {
    setOnboardingReturnStep('year')
    setIsConfigured(false)
  }

  function clearReturnStep() {
    setOnboardingReturnStep(null)
  }

  function addPlannedPeriod(period: PlannedPeriod) {
    setPreferences(prev => ({
      ...prev,
      plannedPeriods: [...prev.plannedPeriods, period],
    }))
  }

  function removePlannedPeriod(id: string) {
    setPreferences(prev => ({
      ...prev,
      plannedPeriods: prev.plannedPeriods.filter(p => p.id !== id),
    }))
  }

  function updatePlannedPeriod(id: string, startDate: string, endDate: string) {
    setPreferences(prev => ({
      ...prev,
      plannedPeriods: prev.plannedPeriods.map(p =>
        p.id === id ? { ...p, startDate, endDate } : p
      ),
    }))
  }

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      setRegion,
      setTotalAvailableDays,
      setDaysToUse,
      setYear,
      setSector,
      isConfigured,
      onboardingReturnStep,
      confirmConfiguration,
      resetConfiguration,
      goBackToOnboarding,
      clearReturnStep,
      addPlannedPeriod,
      removePlannedPeriod,
      updatePlannedPeriod,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences(): UserPreferencesContextType {
  const ctx = useContext(UserPreferencesContext)
  if (!ctx) throw new Error('useUserPreferences debe usarse dentro de UserPreferencesProvider')
  return ctx
}