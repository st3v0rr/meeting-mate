<script lang="ts">
	import { onMount } from 'svelte'
	let time = new Date()

	// these automatically update when `time`
	// changes, because of the `$:` prefix
	$: hours = time.getHours()
	$: minutes = time.getMinutes()
	$: seconds = time.getSeconds()

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date()
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	})
</script>

<div class="clock">
	<svg viewBox="-60 -60 120 120">

		<!-- shadow behind the clock -->
		<filter id="shadow" color-interpolation-filters="sRGB">
			<feDropShadow
				dx="0"
				dy="0"
				stdDeviation="5"
				flood-opacity=".5"
				flood-color="var(--primary)"
			/>
		</filter>

		<circle class="clock-face" r="48" />

		<!-- markers -->
		{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
			<line class="major" y1="35" y2="45" transform="rotate({30 * minute})" />

			{#each [1, 2, 3, 4] as offset}
				<line class="minor" y1="42" y2="45" transform="rotate({6 * (minute + offset)})" />
			{/each}
		{/each}

		<!-- hour hand -->
		<line class="hour" y1="0" y2="-25" transform="rotate({30 * hours + minutes / 2})" />

		<!-- minute hand -->
		<line class="minute" y1="0" y2="-38" transform="rotate({6 * minutes + seconds / 10})" />

		<!-- second hand -->
		<line class="second" y1="0" y2="-38" transform="rotate({6 * seconds})" />

		<!-- center circle -->
		<circle class="clock-center" r="4" />
	</svg>

	<svg height="0" width="0" />
</div>

<style>
	.clock {
		text-align: center;
	}

	svg {
		width: 80%;
		height: 80%;
	}

	.clock-face {
		fill: white;
		filter: url(#shadow);
	}

	.minor {
		stroke: #999;
		stroke-width: 0.5;
	}

	.major {
		stroke: #333;
		stroke-width: 1;
	}

	.hour {
		stroke: #000;
		stroke-width: 1.5;
	}

	.minute {
		stroke: #000;
		stroke-width: 1.5;
	}

	.second {
		stroke: var(--primary);
		stroke-width: 1.5;
	}
</style>
