<script lang="ts" context="module">
	declare var document: any
	import './styles.css'
</script>

<script lang="ts">
	import SvelteTheme from 'svelte-themes/SvelteTheme.svelte'
	import { setTheme } from 'svelte-themes/themeStore'
	import { onMount } from 'svelte'
	import { members } from '../stores/members'

	onMount(() => {
		const params = new URLSearchParams(document.location.search)
		if (params.has('members')) {
			const membersString = params.get('members') || ''
			if (membersString) {
				members.setMembers(membersString.split(','))
			}
		} else if (params.has('tc')) {
			members.setTribeClub()
		} else {
			members.setAdorsys()
		}
		setTheme(params.has('tc') ? 'tribeclub' : 'adorsys')
	})
</script>

<div class="app">
	<SvelteTheme themes={['adorsys', 'tribeclub']}/>
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		max-width: 25rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
