<script lang="ts" context="module">
	declare var document: any
</script>

<script lang="ts">
	import { themeStore } from '$lib/stores/theme'
	import MdPlaylistAddCheck from 'svelte-icons/md/MdPlaylistAddCheck.svelte'
	import MdAdd from 'svelte-icons/md/MdAdd.svelte'
	import MdRemove from 'svelte-icons/md/MdRemove.svelte'
	import MdCancel from 'svelte-icons/md/MdCancel.svelte'
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte'
	import { members } from '../../stores/members'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'

	const baseUrl = writable('')
	
	let membersSorted = $derived($members.sort((a, b) => (a.name < b.name ? -1 : 1)))
	let membersParam = $derived(`members=${$members.map((x) => x.name).join(',')}`)
	let url = $derived(`${$baseUrl}?${membersParam}`)

	onMount(() => baseUrl.set(`${document.location.protocol}//${document.location.host}`))

	let newMemberName = ''
	let buttonText: string = 'Copy to Clipboard'
	let timeoutId: NodeJS.Timeout
	let disableButton = false

	// $: url = `${document.location.host}?members=${$members.map(m => m.name).join(',')}`;

	const addNewMember = () => {
		if (newMemberName.trim()) {
			members.add(newMemberName)
			newMemberName = ''
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addNewMember()
		}
	}

	function copyUrlToClipboard() {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				buttonText = 'Copied!'
				disableButton = true

				// Reset the button text after 3 seconds
				timeoutId = setTimeout(() => {
					buttonText = 'Copy to Clipboard'
					disableButton = false
				}, 1000)
			})
			.catch((err) => {
				console.error('Failed to copy: ', err)
			})
	}

	function goBack() {
		window.history.back()
	}
</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<header>
		<button class="icon" on:click={goBack}><MdArrowBack /></button>
		<h1>Settings</h1>
	</header>

	<div class="select-group">
		<h2>Themes</h2>
		<select value={$themeStore} on:change={(e) => themeStore.setTheme(e.target.value)}>
			{#each themeStore.themes as t}
				<option value={t}>{t}</option>
			{/each}
		</select>
	</div>

	<div class="members">
		<h2 class="members-title">Members</h2>
		<div class="members-list">
			{#each membersSorted as member}
				<div class="row member">
					<button class="icon" on:click={() => members.toggle(member.name)}
						>{#if member.present}<MdPlaylistAddCheck />{:else}<MdCancel />{/if}</button
					>
					<span>{member.name}</span>
					<button class="icon" on:click={() => members.remove(member.name)}><MdRemove /></button>
				</div>
			{/each}
		</div>
	</div>
	<div class="add-user">
		<div class="add-user-group">
			<input bind:value={newMemberName} placeholder="add new member" id="add-user" on:keydown={handleKeyDown} />
			<button class="icon" on:click={addNewMember}><MdAdd /></button>
		</div>
	</div>

	<div class="url-section">
		<h2>URL:</h2>
		<textarea name="url" id="url-text">{url}</textarea>
		<button
			class="url-copy-btn"
			disabled={!membersParam || disableButton}
			on:click={copyUrlToClipboard}>{buttonText}</button
		>
	</div>
</section>

<style>
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.icon {
		background-color: transparent;
		border: none;
		color: var(--color-text);
		height: 24px;
		outline: none;
		cursor: pointer;
		padding: 0 0;
	}
	.icon:hover {
		color: var(--primary);
		border-radius: 5px;
	}

	header {
		width: 100%;
		display: flex;
		align-items: center;
	}
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 24px;
	}

	h1 {
		display: inline;
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		padding-left: 16px;
	}

	h2 {
		margin: 0 0 8px 0;
	}

	.select-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 40px;
	}

	select {
		width: 100%;
		height: 36px;
		padding: 4px;
		border-radius: 5px;
		border: 1px solid transparent;
		text-transform: uppercase;
		background-color: var(--highlight);
	}

	.members {
		width: 100%;
		margin-top: 32px;
	}

	.members-title {
		font-size: 24px;
		font-weight: 700;
	}

	.member {
		padding: 4px;
		margin: 2px 0 2px 0;
		border-radius: 5px;
	}

	.members-list div:nth-child(odd) {
		background-color: var(--highlight);
	}

	.members-list div:nth-child(even) {
		background-color: var(--secondary);
	}

	.add-user {
		width: 100%;
	}

	.add-user-group {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 4px;
		background-color: #fff;
		border: 2px solid transparent;
		border-radius: 5px;
		box-sizing: border-box;
	}

	#add-user {
		width: 100%;
		height: 28px;
		outline: none;
		box-sizing: border-box;
		border: none;
	}

	.add-user-group:focus-within {
		border: 2px solid var(--primary);
	}

	.url-section {
		width: 100%;
		margin-top: 24px;
		display: flex;
		flex-direction: column;
	}

	#url-text {
		height: 64px;
	}
	
	.url-copy-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 38px;
		background: var(--highlight);
		border: 1px solid transparent;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 8px;
	}

	.url-copy-btn:hover {
		border: 1px solid var(--primary);
	}
	.url-copy-btn:active {
		background-color: var(--secondary);
	}
	.url-copy-btn:disabled {
		cursor: not-allowed;
		border: 1px solid transparent;
	}
</style>
