<script lang="ts">
	import { members } from '../stores/members'
	import TiArrowShuffle from 'svelte-icons/ti/TiArrowShuffle.svelte'

	$: membersPresentAndRanked = $members.filter((a) => a.present).sort((a, b) => a.rank - b.rank)
</script>

<span class="icon" on:click={members.shuffle}><TiArrowShuffle /></span>
<div class="members">
	<div class="memberList">
		{#each membersPresentAndRanked as member, i}
			<div class="member">
				{member.name}
			</div>
		{/each}
	</div>
</div>

<style>
	.memberList div:nth-child(odd) {
		background-color: #ffffff;
	}

	.memberList div:nth-child(even) {
		background-color: #dddddd;
	}

	[data-theme='adorsys'] .memberList div:nth-child(odd) {
		background-color: #f8f9f9;
	}

	[data-theme='adorsys'] .memberList div:nth-child(even) {
		background-color: #8498f4;
	}

	[data-theme='tribeclub'] .memberList div:nth-child(odd) {
		background-color: #f6d6e6;
	}

	[data-theme='tribeclub'] .memberList div:nth-child(even) {
		background-color: #f8f9f9;
	}

	.members {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.member {
		background-color: white;
		margin: 2px 0 2px 0;
		padding: 2px 1em 2px 1em;
		border: 1px solid lightgrey;
		border-radius: 5px;
		display: flex;
		height: 30px;
		justify-content: space-between;
		align-items: center;
		font-size: 16pt;
		font-weight: bold;
	}

	.icon {
		width: 30px;
		cursor: pointer;
		opacity: 0.8;
	}

	.icon:hover {
		opacity: 1;
	}

</style>
