<script>
	import Clock from './Clock.svelte'
	import Notes from './Notes.svelte'
	import Countdown from './Countdown.svelte'
	import MateList from './MemberList.svelte'
	import TribeclubLogo from '$lib/images/Tribeclub_Logo.png'
	import TiCogOutline from 'svelte-icons/ti/TiCog.svelte'
	import themeStore from 'svelte-themes/themeStore'
</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<header class="menu">
		{#if $themeStore.theme === 'tribeclub'}
			<div class="logo">
				<img src={TribeclubLogo} alt="Logo of TribeClub" />
			</div>
		{/if}
		<Clock />
		<a class="settings" href="/settings"><TiCogOutline /></a>
	</header>
	<Countdown />
	<MateList />
	<!--Notes /-->
</section>

<style>
	.menu {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		text-align: center;
		margin-bottom: 5vh;
	}

	.logo {
		width: 15%;
	}
	.logo > img {
		height: 80px;
	}
	.settings {
		width: 15%;
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
</style>
