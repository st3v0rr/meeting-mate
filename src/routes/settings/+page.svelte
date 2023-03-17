<script>
    import { membersSorted, members } from "../../stores/members";
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
        </label>
		{/each}

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
