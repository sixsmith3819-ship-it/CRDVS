'use client'

import { useState, useEffect, useCallback } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'crdvs-theme'

function applyTheme(theme: Theme) {
  const html = document.documentElement
  if (theme === 'light') {
    html.classList.remove('dark')
    html.classList.add('light')
  } else {
    html.classList.remove('light')
    html.classList.add('dark')
  }
}

/**
 * Resolve initial theme from localStorage only.
 * We do NOT read prefers-color-scheme because the UI uses hardcoded
 * dark-theme Tailwind classes throughout — a light OS preference would
 * swap the CSS variables to light values while all text/bg classes stay
 * dark, making the dashboard unreadable.
 *
 * Default is always 'dark' unless the user explicitly toggled to light.
 */
function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  // Always default to dark — light mode is not yet fully implemented
  return 'dark'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark')

  // Initialise from localStorage only on mount (client-side)
  useEffect(() => {
    const resolved = resolveInitialTheme()
    setThemeState(resolved)
    applyTheme(resolved)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      applyTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme, setTheme }
}
