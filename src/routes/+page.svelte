<script>
	import Clock from './Clock.svelte'
	import Notes from './Notes.svelte'
	import Countdown from './Countdown.svelte'
	import MateList from './MemberList.svelte'
	import TribeclubLogo from '$lib/images/Tribeclub_Logo.png'
	import AdorsysLogo from '$lib/images/Adorsys_Logo.png'
	import SystemLogo from '$lib/images/System_Logo.svg'
	import MdSettings from 'svelte-icons/md/MdSettings.svelte'
	import themeStore from 'svelte-themes/themeStore'
	import Countdown2 from './Countdown2.svelte'

	const logoData = {
		tribeclub: { src: TribeclubLogo, alt: 'Logo of TribeClub' },
		adorsys: { src: AdorsysLogo, alt: 'Logo of Adorsys' },
		default: { src: SystemLogo, alt: 'Default Logo' }
	}
</script>

<svelte:head>
	<title>Meeting Mate</title>
	<meta name="description" content="adorsys Meeting Mate" />
</svelte:head>

<section>
	<header class="menu">

		<div class="logo">
			{#if $themeStore.theme in logoData}
				<img src={logoData[$themeStore.theme].src} alt={logoData[$themeStore.theme].alt} />
			{/if}
		</div>
		<a class="settings icon" href="/settings"><MdSettings /></a>

	</header>
	<Clock />
	<Countdown />
	<!-- <Countdown2 /> -->
	<MateList />
	<!--Notes /-->
</section>

<style>
	.menu {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.logo > img {
		width: 100px;
		height: auto;
	}

	.settings {
		display: block;
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
