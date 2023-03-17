<script>
	import { tweened } from 'svelte/motion';
  let original = 10 * 60; // TYPE NUMBER OF SECONDS HERE
	let timer = tweened(original)

  // ------ dont need to modify code below
  setInterval(() => {
    if ($timer > 0) $timer--;
  }, 1000);

  $: minutes = Math.floor($timer / 60);
  $: minname = minutes > 1 ? "mins" : "min";
  $: seconds = Math.floor($timer - minutes * 60)
</script>

<main>

  {#if timer < 1}
    <Typewriter loop>
      <h1>Starting soon....</h1>
    </Typewriter>
  {:else}
<h1>Timer: <span class="mins">{minutes}</span>{minname} 
	
	<span class="secs">{seconds}</span>s</h1>
<progress value={$timer/original}></progress>
  {/if}
  <!-- 	feel free to modify this text!! -->
</main>

<style>
</style>
