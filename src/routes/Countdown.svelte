<script xmlns="http://www.w3.org/1999/html">
  import {tweened} from 'svelte/motion';
  import FaRegPauseCircle from 'svelte-icons/fa/FaRegPauseCircle.svelte';
  import FaRegPlayCircle from 'svelte-icons/fa/FaRegPlayCircle.svelte';
  import FaCreativeCommonsSa from 'svelte-icons/fa/FaCreativeCommonsSa.svelte'

  let original = 1 * 60; // TYPE NUMBER OF SECONDS HERE
  let timer = tweened(original)
  let countdownInterval = setInterval(() => {
    if ($timer > 0) {
      $timer--;
    }
  }, 1000);
  let running = true;

  const startOrPauseTimer = () => {
    if(running) {
      clearInterval(countdownInterval);
      running = false;
    } else {
      countdownInterval = setInterval(() => {
        if ($timer > 0) {
          $timer--;
        }
      }, 1000);
      running = true;
    }

  }

  const stopTimer = () => {
    clearInterval(countdownInterval);
    running = false;
  }


  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer - minutes * 60)
</script>

<main>
    <div class="container">
      <div class="timercontainer">
        <div class="buttongroup">

          {#if running}
            <span on:click="{startOrPauseTimer}"><FaRegPauseCircle /></span>
          {:else}
            <span on:click="{startOrPauseTimer}"><FaRegPlayCircle /></span>
          {/if}
          <span on:click="{stopTimer}"><FaCreativeCommonsSa /></span>
        </div>
        <div class="timer">
          <input type="number" class="mins" value="{('0'+minutes).slice(-2)}" on:click="{() => clearInterval(countdownInterval)}"/>
          <span class="divider">:</span>
          <input type="number" class="secs" value="{('0'+seconds).slice(-2)}" on:click="{() => clearInterval(countdownInterval)}"/>
        </div>
        </div>
      <div class="progresscontainer">
        <progress value={$timer/original} class="progress"></progress>
      </div>
    </div>
  <!-- 	feel free to modify this text!! -->
</main>

<style>
  .container {

  }
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
  .mins {
    background: none;
    border: none;
    text-align: center;
    font-size: 4rem;
  }
  .secs {
    background: none;
    border: none;
    text-align: center;
    font-size:3rem;
    padding-bottom: 5px;
  }
  .divider {
    font-size: 2rem;
    padding-bottom: 14px;
  }

  .timer {
    display: flex;

    width: 50%;
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
