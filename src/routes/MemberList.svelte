<script lang="ts">
	import { membersPresent, members } from '../stores/members'
	import IoIosShuffle from 'svelte-icons/io/IoIosShuffle.svelte'
</script>

<div class="members">
	
	<div class="memberList">
	{#each $membersPresent as member, i}
	<div class="member">{member.name} {#if i === 0} <span class="icon" on:click={members.shuffle}><IoIosShuffle/></span>{/if}</div>
	{/each}
</div>
</div>

<style>
	.memberList div:first-child {
		background-color: #F6CEE1;
	}

	.members {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.members > span {
		height: 30px;
	}

	.member {
		background-color: white;
		width: 100%;
		margin: 2px 0 2px 0;
		padding: 2px 1em 2px 1em;
		border: 1px solid rgb(242, 242, 242);
		border-radius: 5px;
		display: flex;
		height: 30px;
		justify-content: space-between;
		align-items: center;
	}

	.icon {
		width: 30px;
		cursor: pointer;
		opacity: 0.8;
	}

	.icon:hover {
		opacity: 1;
	}

	.counter {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
	}

	.counter button {
		width: 2em;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
		font-size: 2rem;
	}

	.counter button:hover {
		background-color: var(--color-bg-1);
	}

	svg {
		width: 25%;
		height: 25%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #444;
	}

	.counter-viewport {
		width: 8em;
		height: 4em;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--color-theme-1);
		font-size: 4rem;
		align-items: center;
		justify-content: center;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
