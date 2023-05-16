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
			setTheme('tribeclub')
		} else if(params.has('ad')) {
			members.setAdorsys()
			setTheme('adorsys')
		} else {
			setTheme('system')
		}
	})
</script>

<div class="app">
	<SvelteTheme themes={['adorsys', 'tribeclub']} defaultTheme={'system'}/>
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
</style>
