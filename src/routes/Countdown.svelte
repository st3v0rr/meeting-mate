<script lang="ts">
	import { tweened } from 'svelte/motion'
	import PauseIcon from 'svelte-icons/md/MdPause.svelte'
	import PlayIcon from 'svelte-icons/md/MdPlayArrow.svelte'
	import ResetIcon from 'svelte-icons/md/MdRefresh.svelte'

	let original = 300 // TYPE NUMBER OF SECONDS HERE
	let timer = tweened(original)

	const addTime = [5, 10, 15, 20]

	let countdownInterval: ReturnType<typeof setInterval> | null = null
	let running = false

	const clearExistingInterval = () => {
		if (countdownInterval) {
			clearInterval(countdownInterval)
			countdownInterval = null
		}
	}

	const startTimer = () => {
		clearExistingInterval()
		countdownInterval = setInterval(() => {
			if ($timer > 0) {
				$timer--
			} else {
				clearExistingInterval()
				running = false
			}
		}, 1000)
		running = true
	}

	const pauseTimer = () => {
		clearExistingInterval()
		running = false
	}

	const startOrPauseTimer = () => {
		if (running) {
			pauseTimer()
		} else {
			startTimer()
		}
	}

	const stopTimer = () => {
		clearExistingInterval()
		$timer = original
		running = false
	}

	const setMinutes = (event: Event) => {
		const target = event.target as HTMLInputElement
		clearExistingInterval()
		original = parseInt(target.value) * 60 + seconds
		$timer = original
		running = false
	}

	const setSeconds = (event: Event) => {
		const target = event.target as HTMLInputElement
		clearExistingInterval()
		original = minutes * 60 + parseInt(target.value)
		$timer = original
		running = false
	}

	const setTime = (event: MouseEvent) => {
		const target = event.currentTarget as HTMLButtonElement
		clearExistingInterval()
		original = parseInt(target.value) * 60
		$timer = original
		running = false
	}

	$: minutes = Math.floor($timer / 60)
	$: seconds = Math.floor($timer - minutes * 60)
</script>

<div class="container">
	<div class="timercontainer">
		<div class="timer">
			<input
				type="number"
				class="digits"
				value={('0' + minutes).slice(-2)}
				min="0"
				max="60"
				on:blur={(event) => setMinutes(event)}
			/>
			<span class="divider">:</span>
			<input
				type="number"
				class="digits secs"
				value={('0' + seconds).slice(-2)}
				on:blur={(event) => setSeconds(event)}
				min="0"
				max="60"
			/>
		</div>
		<div class="buttongroup">
			{#if running}
				<button class="icon" on:click={startOrPauseTimer}><PauseIcon /></button>
			{:else}
				<button class="icon" on:click={startOrPauseTimer}><PlayIcon /></button>
			{/if}
			<button class="icon" on:click={stopTimer}><ResetIcon /></button>
		</div>
	</div>
	<progress value={$timer / original} class="progress"></progress>
	<div class="add-time">
		{#each addTime as addTime}
			<button class="add-time-btn" value={addTime} on:click={setTime}>{addTime}</button>
		{/each}
	</div>
</div>

<style>
	.buttongroup {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		align-self: center;
	}

	.icon {
		height: 36px;
		background-color: transparent;
		border: none;
		outline: none;
		cursor: pointer;
	}

	.icon:active {
		color: var(--primary);
	}

	.timercontainer {
		margin-top: 1rem;
		display: flex;
		font-weight: bold;
		align-items: flex-end;
		vertical-align: text-bottom;
		align-content: end;
	}

	.digits {
		background: none;
		border: none;
		text-align: center;
		font-size: 4rem;
		max-width: 90px;
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
	}

	progress {
		width: 100%;
		height: 16px;
		border-radius: 5px;
		margin-bottom: 1rem;
		background-color: var(--highlight);
		color: var(--primary);
	}

	/* background: */
	progress::-webkit-progress-bar {
		background-color: var(--highlight);
	}

	/* value: */
	progress::-webkit-progress-value {
		background-color: var(--primary) !important;
	}
	progress::-moz-progress-bar {
		background-color: var(--primary) !important;
	}

	.add-time {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-bottom: 2rem;
	}

	.add-time-btn {
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

	.add-time-btn:hover {
		border: 1px solid var(--primary);
	}
	.add-time-btn:active {
		background-color: var(--secondary);
	}
</style>
