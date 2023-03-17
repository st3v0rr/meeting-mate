<script>
	import Clock from './Clock.svelte';
	import Notes from './Notes.svelte';
	import Countdown from './Countdown.svelte';
	import MateList from './MemberList.svelte';
	import TribeclubLogo from '$lib/images/Tribeclub_Logo.png';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte'
</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<a class="settings" href="/settings"><MdSettings /></a>
	<header>
		<img src={TribeclubLogo} alt="Logo of TribeClub"/>
		<Clock />
	</header>
	<Countdown />
	<MateList />
	<Notes />
</section>

<style>
	.settings {
		position: absolute;
		top: 10px;
		right: 10px;
		color: black;
		height: 40px;
	}
	section {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex: 0.6;
	}

	header {
		text-align: center;
		margin-bottom: 10rem;
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
