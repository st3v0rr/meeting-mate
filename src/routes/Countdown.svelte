<script xmlns="http://www.w3.org/1999/html">
	import { tweened } from 'svelte/motion'
	import TiMediaPauseOutline from 'svelte-icons/ti/TiMediaPause.svelte'
	import TiMediaPlayOutline from 'svelte-icons/ti/TiMediaPlay.svelte'
	import TiRefreshOutline from 'svelte-icons/ti/TiRefresh.svelte'

	let original = 1 * 60 // TYPE NUMBER OF SECONDS HERE
	let timer = tweened(original)
	console.log(original)
	let countdownInterval = setInterval(() => {
		if ($timer > 0) {
			$timer--
		}
	}, 1000)
	let running = true

	const startOrPauseTimer = () => {
		if (running) {
			clearInterval(countdownInterval)
			running = false
		} else {
			countdownInterval = setInterval(() => {
				if ($timer > 0) {
					$timer--
				}
			}, 1000)
			running = true
		}
	}

	const stopTimer = () => {
		$timer = original
		clearInterval(countdownInterval)
		running = false
	}

	const setMinutes = (event) => {
		original = parseInt(event.target.value) * 60 + seconds
		timer = tweened(original)
		running = false
	}

	const setSeconds = (event) => {
		original = minutes * 60 + parseInt(event.target.value)
		timer = tweened(original)
		running = false
	}

	$: minutes = Math.floor($timer / 60)
	$: seconds = Math.floor($timer - minutes * 60)
</script>

<main>
	<div class="container">
		<div class="timercontainer">
			<div class="buttongroup">
				{#if running}
					<span on:click={startOrPauseTimer}><TiMediaPauseOutline /></span>
				{:else}
					<span on:click={startOrPauseTimer}><TiMediaPlayOutline /></span>
				{/if}
				<span on:click={stopTimer}><TiRefreshOutline /></span>
			</div>
			<div class="timer">
				<input
					type="number"
					class="digits"
					value={('0' + minutes).slice(-2)}
					min="0"
					max="60"
					on:blur={(event) => setMinutes(event)}
					on:click={() => clearInterval(countdownInterval)}
				/>
				<span class="divider">:</span>
				<input
					type="number"
					class="digits secs"
					value={('0' + seconds).slice(-2)}
					on:blur={(event) => setSeconds(event)}
					min="0"
					max="60"
					on:click={() => clearInterval(countdownInterval)}
				/>
			</div>
		</div>
		<progress value={$timer / original} class="progress" />

		<div class="progress">
			<div class="progress-value" />
		</div>
	</div>
	<!-- 	feel free to modify this text!! -->
</main>

<style>
	.buttongroup {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		align-self: center;
	}

	.buttongroup > span {
		height: 30px;
	}

	.timercontainer {
		margin-top: 2rem;
		display: flex;
		font-weight: bold;
		justify-content: center;
		align-items: flex-end;
		vertical-align: text-bottom;
		align-content: end;
	}

	.digits {
		background: none;
		border: none;
		text-align: center;
		font-size: 4rem;
		max-width: 100px;
	}

	.secs {
		margin-left: 16px;
	}

	.divider {
		font-size: 2rem;
		padding-bottom: 14px;
	}

	.timer {
		display: flex;
		align-items: flex-end;
		width: 60%;
	}

	.progress {
		width: 100%;
		max-width: 350px;
		margin-bottom: 2rem;
	}
</style>
