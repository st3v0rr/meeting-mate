<script xmlns="http://www.w3.org/1999/html">
  import {tweened} from 'svelte/motion';

  let original = 1 * 60; // TYPE NUMBER OF SECONDS HERE
  let timer = tweened(original)

  // ------ dont need to modify code below
  const countdownInterval = setInterval(() => {
    if ($timer > 0) {
      $timer--;
    }
  }, 1000);

  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer - minutes * 60)
</script>

<main>

  {#if timer < 1}
    <Typewriter loop>
      <h1>Starting soon....</h1>
    </Typewriter>
  {:else}
    <div class="container">
      <div class="timercontainer">
        <div class="buttongroup">
          <input type="button" class="button" value="start"/>
          <input type="button" class="button" value="stop"/>
        </div>
        <input type="number" class="mins" value="{('0'+minutes).slice(-2)}"/>
        <input type="number" class="secs" value="{('0'+seconds).slice(-2)}"/>
      </div>
      <div class="progresscontainer">
        <progress value={$timer/original} class="progress"></progress>
      </div>
    </div>

  {/if}
  <!-- 	feel free to modify this text!! -->
</main>

<style>
  .container {

  }
  .buttongroup {
    display: flex;
    flex-direction: column;
    align-self: center;
    margin-right: 3rem;
  }
  .button {
    margin: 0.2rem auto;
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
  .mins {
    background: none;
    border: none;
    text-align: center;
    font-size: 4rem;
    width: 25%;
    min-width: 90px;
    max-width: 16rem;
  }
  .secs {
    background: none;
    border: none;
    text-align: center;
    font-size: 3rem;
    width: 20%;
    max-width: 10rem;
    min-width: 90px;
    padding-bottom: 5px;
  }
  .progresscontainer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
  .progress {
    width: 80%;
    max-width: 350px;
  }
</style>
