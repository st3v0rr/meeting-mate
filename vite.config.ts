import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import * as path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: [
				{ find: '$stores', replacement: path.resolve(__dirname, 'src/stores') },
		],
	},
})
