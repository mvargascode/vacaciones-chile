import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UserPreferences } from '../types/user.types'

const DEFAULT_PREFERENCES: UserPreferences = {
  region: 'RM',
  availableDays: 15,
  year: 2025,
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
  } catch {
    // Si hay error de parsing usamos defaults
  }
  return {
    preferences: DEFAULT_PREFERENCES,
    isConfigured: false,
  }
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  setRegion: (region: string) => void
  setAvailableDays: (days: number) => void
  setYear: (year: number) => void
  isConfigured: boolean
  confirmConfiguration: (prefs: UserPreferences) => void
  resetConfiguration: () => void   // ← nuevo
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const loaded = loadPreferences()
  const [preferences, setPreferences] = useState<UserPreferences>(loaded.preferences)
  const [isConfigured, setIsConfigured] = useState<boolean>(loaded.isConfigured)

  useEffect(() => {
    if (isConfigured) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    }
  }, [preferences, isConfigured])

  function setRegion(region: string) {
    setPreferences(prev => ({ ...prev, region }))
  }

  function setAvailableDays(availableDays: number) {
    setPreferences(prev => ({ ...prev, availableDays }))
  }

  function setYear(year: number) {
    setPreferences(prev => ({ ...prev, year }))
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

  return (
    <UserPreferencesContext.Provider value={{
  preferences,
  setRegion,
  setAvailableDays,
  setYear,
  isConfigured,
  confirmConfiguration,
  resetConfiguration,
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