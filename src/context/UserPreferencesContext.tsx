import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UserPreferences } from '../types/user.types'

// Valores por defecto — lo que ve un usuario nuevo
const DEFAULT_PREFERENCES: UserPreferences = {
  region: 'RM',
  availableDays: 15,
  year: 2025,
}

const STORAGE_KEY = 'vacaciones-chile:preferences'

// Cargamos desde localStorage si existe, si no usamos defaults
function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
  } catch {
    // Si hay error de parsing ignoramos y usamos defaults
  }
  return DEFAULT_PREFERENCES
}

// --- Tipos del Context ---
interface UserPreferencesContextType {
  preferences: UserPreferences
  setRegion: (region: string) => void
  setAvailableDays: (days: number) => void
  setYear: (year: number) => void
  isConfigured: boolean   // true si el usuario ya pasó por onboarding
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null)

// --- Provider ---
export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences)
  const [isConfigured, setIsConfigured] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) !== null
  )

  // Cada vez que cambian las preferencias las guardamos en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    setIsConfigured(true)
  }, [preferences])

  function setRegion(region: string) {
    setPreferences(prev => ({ ...prev, region }))
  }

  function setAvailableDays(availableDays: number) {
    setPreferences(prev => ({ ...prev, availableDays }))
  }

  function setYear(year: number) {
    setPreferences(prev => ({ ...prev, year }))
  }

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      setRegion,
      setAvailableDays,
      setYear,
      isConfigured,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

// --- Hook de acceso ---
// Lo exportamos desde acá para que los componentes no importen el Context directamente
export function useUserPreferences(): UserPreferencesContextType {
  const ctx = useContext(UserPreferencesContext)
  if (!ctx) throw new Error('useUserPreferences debe usarse dentro de UserPreferencesProvider')
  return ctx
}