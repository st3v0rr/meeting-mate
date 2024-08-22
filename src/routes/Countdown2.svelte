<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import PauseIcon from 'svelte-icons/md/MdPause.svelte'
	import PlayIcon from 'svelte-icons/md/MdPlayArrow.svelte'
	import ResetIcon from 'svelte-icons/md/MdRefresh.svelte'

	const showMinutes = true,
		showSeconds = true,
		size = 2,
		textColor = 'white',
		backgroundColor = '#383838'

	let isPaused = false,
		totalSeconds = 300, // Default to 300 seconds
		display: { top: string; bottom: string; transition: boolean }[] = [],
		interval: ReturnType<typeof setInterval>,
		inputValue = ''

	// Update segments count based on display configuration
	$: segmentsCount = (showMinutes ? 1 : 0) + (showSeconds ? 1 : 0)

	// Initialize display array based on the number of segments
	$: {
		display = new Array(segmentsCount).fill({
			top: '00',
			bottom: '00',
			transition: false
		})
		updateDisplay()
	}

	// Function to update display
	function updateDisplay() {
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		const newData: string[] = []
		if (showMinutes) newData.push(minutes.toString().padStart(2, '0'))
		if (showSeconds) newData.push(seconds.toString().padStart(2, '0'))
		display = display.map(({ bottom }, i) => ({
			top: newData[i],
			bottom,
			transition: newData[i] !== bottom
		}))
		setTimeout(() => {
			display = display.map(({ top }, i) => ({
				bottom: newData[i],
				top,
				transition: false
			}))
		}, 500)
	}

	// Function to start countdown
	function startCountdown() {
		interval = setInterval(() => {
			if (totalSeconds > 0) {
				totalSeconds--
				updateDisplay()
			} else {
				clearInterval(interval)
			}
		}, 1000)
	}

	function resetTimer() {
		totalSeconds = 300 // Reset to default 300 seconds
		updateDisplay()
		clearInterval(interval)
		startCountdown()
	}

	function togglePauseResume() {
		if (isPaused) {
			startCountdown() // Resume countdown
		} else {
			clearInterval(interval) // Pause countdown
		}
		isPaused = !isPaused // Toggle state
	}

	// Start countdown on mount
	onMount(() => startCountdown())

	// Cleanup interval on destroy
	onDestroy(() => interval && clearInterval(interval))

	// Handle input change
	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement
		const newValue = parseInt(input.value, 10)
		if (!isNaN(newValue)) {
			totalSeconds = newValue * 60 // Convert minutes to seconds
			updateDisplay()
			clearInterval(interval)
			startCountdown()
		}
	}

	function handleBlur() {
		inputValue = ''
	}
</script>

<div class="functions">
	<div class="input-group">
		<label for="time-input" />
		<input
			id="time-input"
			type="number"
			placeholder="Set minutes"
			min="0"
			step="1"
			bind:value={inputValue}
			on:change={handleInput}
			on:blur={handleBlur}
		/>
	</div>

	<div class="button-group">
		<button on:click={resetTimer}>
			Refresh
			<div class="icon"><ResetIcon /></div>
		</button>

		<button on:click={togglePauseResume}>
			{#if isPaused}
				Play <div class="icon"><PlayIcon /></div>
				<!-- Show play icon when paused -->
			{:else}
				Pause <div class="icon"><PauseIcon /></div>
				<!-- Show pause icon when running -->
			{/if}
		</button>
	</div>
</div>

<div
	class="clock"
	style:width="calc((2ch + 0.5em) * {segmentsCount} + 0.1em * {segmentsCount - 1})"
	style:font-size="{size * 2}em"
	style:--flip-clock-text-color={textColor}
	style:--flip-clock-background-color={backgroundColor}
>
	<div class="overlay">
		{#each display as segment}
			<div class="segment">
				<p class="top" class:transition={segment.transition}>
					<span>{segment.bottom}</span>
				</p>
				<p class="bottom" class:transition={segment.transition}>
					<span>{segment.top}</span>
				</p>
			</div>
		{/each}
	</div>
	<div class="base">
		{#each display as segment}
			<div class="segment">
				<p class="top">{segment.top}</p>
				<p class="bottom">{segment.bottom}</p>
			</div>
		{/each}
	</div>
</div>

<style lang="css">
	.clock {
		position: relative;
		height: 2em;
	}
	.base,
	.overlay {
		display: flex;
		gap: 0.1em;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}
	.overlay .bottom {
		transform: scaleY(0);
	}
	.base p {
		border-radius: 0.25em;
	}
	.segment {
		position: relative;
		color: var(--flip-clock-text-color);
		width: 3ch;
		height: 1.51em;
		width: calc(2ch + 0.5em);
	}
	.segment p {
		background: var(--flip-clock-background-color);
		padding: 0.125em 0.25em;
		margin: 0;
		width: 2ch;
		text-align: center;
	}
	.segment .top {
		border-radius: 0.25em 0.25em 0 0;
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		clip-path: inset(0px 0px 50% 0px);
	}
	.segment .top.transition {
		transition: transform 0.25s ease-in;
		transform: scaleY(0);
	}
	.segment .bottom {
		border-radius: 0 0 0.25em 0.25em;
		clip-path: inset(50% 0px 0px 0px);
		top: 0.01em;
		left: 0;
		position: absolute;
		margin: 0;
	}
	.segment .bottom.transition {
		transition: transform 0.25s 0.25s ease-out;
		transform: scale(100%);
	}

	.input-group {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.functions {
		width: 100%;
		/* display: flex;
        align-items: center;
        justify-content: center; */
		margin-bottom: 24px;
	}

	#time-input {
		width: 100%;
		height: 36px;
		border: 2px solid transparent;
		border-radius: 5px;
		outline: none;
		padding-left: 8px;
		margin-top: 8px;
		box-sizing: border-box;
	}

	#time-input:focus {
		border: 2px solid var(--primary);
	}

	.button-group {
		display: flex;
		/* flex-direction: column; */
		gap: 8px;
		align-self: center;
		margin-top: 8px;
	}

	.button-group > button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 50%;
		height: 38px;
		background: var(--highlight);
		border: 1px solid transparent;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		border: 1px solid var(--primary);
	}
	button:active {
		background-color: var(--secondary);
	}

	.icon {
		width: 24px;
	}
</style>
