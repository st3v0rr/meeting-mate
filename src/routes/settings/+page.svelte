<script lang="ts" context="module">
	declare var document: any
</script>

<script lang="ts">
	import TiTimesOutline from 'svelte-icons/ti/TiTimes.svelte'
	import { members } from '../../stores/members'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'

	const baseUrl = writable('')

	$: membersSorted = $members.sort((a, b) => (a.name < b.name ? -1 : 1))
	$: membersParam = `members=${$members.map((x) => x.name).join(',')}`
	$: url = `${$baseUrl}?${membersParam}`

	onMount(() => baseUrl.set(`${document.location.protocol}//${document.location.host}`))

	let newMemberName = ''

	// $: url = `${document.location.host}?members=${$members.map(m => m.name).join(',')}`;

	const addNewMember = () => {
		if (newMemberName !== '') {
			members.add(newMemberName)
			newMemberName = ''
		}
	}

	const copyUrlToClipboard = () => navigator.clipboard.writeText(url)
</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<a class="icon" href="/"><TiTimesOutline /></a>
	<h1>Settings</h1>

	<h2>Members</h2>
	{#each membersSorted as member}
		<label>
			<input
				on:click={() => members.toggle(member.name)}
				type="checkbox"
				checked={member.present}
			/>
			<input value={member.name} />
			<button on:click={() => members.remove(member.name)}>X</button>
		</label>
	{/each}
	<div>
		<input bind:value={newMemberName} />
		<button on:click={addNewMember}>+</button>
	</div>

	<div>
		URL: {url}<button disabled={!membersParam} on:click={copyUrlToClipboard}
			>Copy to clipboard</button
		>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.icon {
		color: black;
		height: 40px;
	}
</style>
