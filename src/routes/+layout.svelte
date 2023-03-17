<script lang="ts" context="module">
	declare var document: any
	import './styles.css'
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import { members } from '../stores/members'

	onMount(() => {
		const membersString = new URLSearchParams(document.location.search).get('members') || ''
		const parsedMembers = membersString.split(',').map((m) => ({ name: m, present: true }))
		members.set(parsedMembers)
	})
</script>

<div class="app">
	<!-- <div>{JSON.stringify($members, null,2)}</div> -->

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
