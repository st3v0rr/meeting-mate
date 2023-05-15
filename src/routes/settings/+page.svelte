<script lang="ts" context="module">
	declare var document: any
</script>

<script lang="ts">
	import themeStore from 'svelte-themes/themeStore'
	import TiArrowBack from 'svelte-icons/ti/TiArrowBack.svelte'
	import TiInputChecked from 'svelte-icons/ti/TiInputChecked.svelte'
	import TiUserAdd from 'svelte-icons/ti/TiUserAdd.svelte'
	import TiUserDelete from 'svelte-icons/ti/TiUserDelete.svelte'
	import TiCancel from 'svelte-icons/ti/TiCancel.svelte'
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
	<a class="icon" href="/"><TiArrowBack /></a>
	<h1>Settings</h1>

	<h2>Themes</h2>
	<select bind:value={$themeStore.theme}>
		{#each $themeStore.themes as theme}
			<option value={theme}>{theme}</option>
		{/each}
	</select>

	<h2>Members</h2>
	{#each membersSorted as member}
		<div class="row">
			<button class="icon" on:click={() => members.toggle(member.name)}>{#if member.present}<TiInputChecked/>{:else}<TiCancel/>{/if}</button>
			{member.name}
			<button class="icon" on:click={() => members.remove(member.name)}><TiUserDelete/></button>
		</div>
	{/each}
	<div class="row">
		<input bind:value={newMemberName} />
		<button class="icon" on:click={addNewMember}><TiUserAdd/></button>
	</div>

	<div>
		URL: {url}<button disabled={!membersParam} on:click={copyUrlToClipboard}
			>Copy to clipboard</button
		>
	</div>

</section>

<style>
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.icon {
		height: 30px;
		border: 8px solid #00000000;
		background-color: #00000000;
	}
	.icon:hover {
		border: 1px solid lightgray;
		height: 40px;
		border-radius: 5px;
	}
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
