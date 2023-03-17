<script lang="ts" context="module">
	declare var document: any;

</script>

<script lang='ts' >
    import { membersSorted, members } from "../../stores/members";
    import { onMount } from 'svelte';

    let newMemberName = '';
    let url = '';

    onMount(() => {
		url = `${document.location.host}?members=${$members.map(m => m.name).join(',')}`;
	} ) 

    // $: url = `${document.location.host}?members=${$members.map(m => m.name).join(',')}`;

    const addNewMember = () => {
        if (newMemberName !== '')  {
            members.add(newMemberName)
            newMemberName = ''
        }
    }

    const copyUrlToClipboard = () => {
        const domain = document.location;

        navigator.clipboard.writeText(url);
    }


</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<h1>Settings</h1>
    <a href="/">Back</a>
    <h2>Members</h2>
		{#each $membersSorted as member}
		<label>
            <input on:click={() => members.togglePresence(member.name)} type="checkbox" checked={member.present}/>
            <input value={member.name}/>
            <button on:click={() => members.remove(member.name)}>X</button>
        </label>
		{/each}
        <div>
            <input bind:value={newMemberName}/>
            <button on:click={addNewMember}>+</button>
        </div>

        <div>URL: <input value={url}/><button on:click={copyUrlToClipboard}>Copy to clipboard</button></div>

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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
