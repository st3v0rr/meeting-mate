import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: [
			{ find: '$stores', replacement: fileURLToPath(new URL('./src/stores', import.meta.url)) },
		],
	},
	optimizeDeps: {
		exclude: ['svelte-themes']
	}
})
