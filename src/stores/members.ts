import { writable, type Writable, derived } from 'svelte/store';

const values: Writable<Member[]> = writable([]);

values.set([
	{ name: 'Jana', present: true },
	{ name: 'Gunnar', present: true },
	{ name: 'Andi', present: true },
	{ name: 'Nicole', present: true },
	{ name: 'Nadja', present: true },
	{ name: 'Tobi', present: true },
	{ name: 'Annina', present: true },
	{ name: 'Stefan', present: true },
	{ name: 'Thomas', present: true },
	{ name: 'Flo', present: true },
    { name: 'Eva', present: true },
	{ name: 'Nina', present: true }
]);

const shuffle = () => {
	values.update((m) =>
		m
			.map((x) => ({ mate: x, order: Math.random() }))
			.sort((a, b) => a.order - b.order)
			.map((x) => x.mate)
	);
};

const togglePresence = (name: string) => {
    console.log(name)
    values.update((m) => {
        console.log(JSON.stringify(m, null, 2))
        return m.map(v => v.name === name ? {...v, present: !v.present} : v)
    }
    )
}

export const members = {
	...values,
	shuffle,
    togglePresence
};

interface Member {
	name: string;
	present: boolean;
}

export const membersSorted = derived(values, $values => $values.sort((a,b) => a.name < b.name ? -1 : 1))

export const membersPresent = derived(values, $values => $values.filter(a => a.present))

