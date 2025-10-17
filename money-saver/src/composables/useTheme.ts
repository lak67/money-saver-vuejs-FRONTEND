import { onMounted, ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme'

export function useTheme() {
  const theme = ref<Theme>('system')
  
  // Get the actual resolved theme (light or dark)
  const resolvedTheme = ref<'light' | 'dark'>('light')

  // Check if system prefers dark mode
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    let actualTheme: 'light' | 'dark'
    
    if (newTheme === 'system') {
      actualTheme = getSystemTheme()
    } else {
      actualTheme = newTheme
    }
    
    // Apply the theme
    if (actualTheme === 'dark') {
      root.classList.add('dark')
    }
    
    resolvedTheme.value = actualTheme
  }

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
    applyTheme(newTheme)
  }

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('light')
    } else {
      // If system theme, switch to opposite of current resolved theme
      setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')
    }
  }

  // Initialize theme on mount
  onMounted(() => {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme || 'system'
    theme.value = savedTheme
    applyTheme(savedTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  })

  // Watch for theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    getSystemTheme
  }
}