import { useState } from 'react'

const STORAGE_KEY = 'ios-install-banner-dismissed'

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(navigator as Navigator & { standalone?: boolean }).standalone
}

function isBrave(): boolean {
  return 'brave' in navigator
}

function isSafariIOS(): boolean {
  return !isBrave() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function useIOSInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )

  const visible = isIOS() && !dismissed
  const isSafari = isSafariIOS()

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  return { visible, isSafari, dismiss }
}
