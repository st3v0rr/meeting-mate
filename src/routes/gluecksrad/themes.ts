import type { Theme } from '$lib/stores/theme'

export const wheelThemes = {
	default: {
		label: 'Glücksrad',
		accent: '#365e4c',
		ink: '#20382d',
		surface: '#f6fff8',
		segments: ['#365e4c', '#527d68', '#406957', '#476f5a']
	},
	adorsys: {
		label: 'adorsys',
		accent: '#2f2cf9',
		ink: '#202952',
		surface: '#f5f7ff',
		segments: ['#2f2cf9', '#2934a3', '#4758b8', '#3449d4']
	},
	tribeclub: {
		label: 'TribeCLUB',
		accent: '#ee91b2',
		ink: '#35141d',
		surface: '#fff2f7',
		segments: [
			'#7d263f',
			'#171317',
			'#98334f',
			'#21191d',
			'#662136',
			'#100e10',
			'#873047',
			'#2a1b21'
		]
	}
} satisfies Record<
	Theme,
	{ label: string; accent: string; ink: string; surface: string; segments: string[] }
>
