import { writable, type Writable } from 'svelte/store'

interface Member {
	name: string
	present: boolean
	rank: number
}

const adorsys = [
	'Thilo',
	'Andrew',
	'Kati',
	'André',
	'Nadja',
	'Stephan',
	'Tim',
]

const tribeClub = [
	'Andi',
	'Annina',
	'Flo',
	'Gunnar',
	'Jana',
	'Nadja',
	'Nicole',
	'Nina',
	'Sajjad',
	'Stefan',
	'Thomas',
	'Tobi'
]

const randomizeRank = (x: Member) => ({ ...x, rank: Math.random() })

const togglePresence = (x: Member) => ({ ...x, present: !x.present })

const createMember = (name: string, rank: number = Math.random()) => ({ name, present: true, rank })

const shuffle = () => store.update((xs) => xs.map(randomizeRank))
const toggle = (name: string) =>
	store.update((xs) => xs.map((x) => (x.name === name ? togglePresence(x) : x)))
const add = (name: string) =>
	store.update((xs) => (xs.some((x) => x.name === name) ? xs : [...xs, createMember(name, xs.length)]))
const remove = (name: string) => store.update((xs) => xs.filter((x) => x.name !== name))
const setMembers = (members: Array<string>) => store.set(members.map(createMember))
const setTribeClub = () => store.set(tribeClub.map(createMember))
const setAdorsys = () => store.set(adorsys.map(createMember))

const store: Writable<Member[]> = writable([])

export const members = {
	...store,
	set: undefined,
	setMembers,
	setTribeClub,
	setAdorsys,
	shuffle,
	toggle,
	remove,
	add
}
