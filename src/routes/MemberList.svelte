<script lang="ts">
	import { members } from '../stores/members'
	import MdShuffle from 'svelte-icons/md/MdShuffle.svelte'

	$: membersPresentAndRanked = $members.filter((a) => a.present).sort((a, b) => a.rank - b.rank)
</script>

<span class="icon" on:click={members.shuffle}><MdShuffle /></span>
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
		background-color: var(--highlight);
	}

	.memberList div:nth-child(even) {
		background-color: var(--secondary);
	}

	.members {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.member {
		margin: 2px 0;
		padding: 2px 1em;
		border: none;
		border-radius: 5px;
		display: flex;
		height: 30px;
		justify-content: space-between;
		align-items: center;
		font-size: 14pt;
		font-weight: bold;
	}

	.icon {
		width: 28px;
		cursor: pointer;
	}


</style>
