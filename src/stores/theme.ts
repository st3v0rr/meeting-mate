import { writable, type Writable } from 'svelte/store'

const store: Writable<string> = writable('adorsys')

export const theme = {
	...store,
}
