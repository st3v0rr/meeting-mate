<script lang="ts">
	import { onMount } from 'svelte';
	let currentTime = new Date()

	// these automatically update when `time`
	// changes, because of the `$:` prefix
	$: hours = currentTime.getHours();
	$: minutes = currentTime.getMinutes();
	$: seconds = currentTime.getSeconds();

	onMount(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="clock">
	<div>{`${hours}:${minutes}:${seconds}`}</div>
</div>

<style>
</style>
