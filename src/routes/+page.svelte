<script>
	import Clock from './Clock.svelte';
	import Notes from './Notes.svelte';
	import Countdown from './Countdown.svelte';
	import MateList from './MateList.svelte';
	import TribeclubLogo from '$lib/images/Tribeclub_Logo.png';
</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<img src={TribeclubLogo} alt="Logo of TribeClub"/>
	<Clock />
	<Countdown />
	<MateList />
	<Notes />
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
