import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'default' | 'adorsys' | 'tribeclub'

const themes: Theme[] = ['default', 'adorsys', 'tribeclub']

// Get initial theme from localStorage or default
function getInitialTheme(): Theme {
	if (!browser) return 'default'
	
	const stored = localStorage.getItem('theme') as Theme
	if (stored && themes.includes(stored)) {
		return stored
	}
	
	// Check URL params
	const params = new URLSearchParams(window.location.search)
	if (params.has('tc')) return 'tribeclub'
	if (params.has('ad')) return 'adorsys'
	
	return 'default'
}

function createThemeStore() {
	const initialTheme = getInitialTheme()
	
	// Set initial theme attribute
	if (browser) {
		document.documentElement.setAttribute('data-theme', initialTheme)
	}
	
	const { subscribe, set, update } = writable<Theme>(initialTheme)

	return {
		subscribe,
		setTheme: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme)
				document.documentElement.setAttribute('data-theme', theme)
			}
			set(theme)
		},
		themes
	}
}

export const themeStore = createThemeStore()
export type { Theme }
