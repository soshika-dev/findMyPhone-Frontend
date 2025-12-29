import { onMounted, ref } from 'vue'

const THEME_KEY = 'findmy-theme'
const themes = ['light', 'dark'] as const
export type Theme = (typeof themes)[number]

export function useTheme() {
  const theme = ref<Theme>('light')

  const applyTheme = (value: Theme) => {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(THEME_KEY, value)
  }

  const toggleTheme = () => {
    const next = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(next)
  }

  onMounted(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    if (stored && themes.includes(stored)) {
      applyTheme(stored)
    } else {
      applyTheme('light')
    }
  })

  return { theme, toggleTheme, applyTheme }
}
