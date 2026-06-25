import { useState } from 'react'

const STORAGE_KEY = 'ios-install-banner-dismissed'

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function isStandalone(): boolean {
  return (navigator as Navigator & { standalone?: boolean }).standalone === true
}

export function useIOSInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )

  const visible = isIOS() && !isStandalone() && !dismissed

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  return { visible, dismiss }
}
