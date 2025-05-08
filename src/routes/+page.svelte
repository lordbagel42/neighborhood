<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.instruments as instrument}
		<li>{instrument.name}</li>
	{/each}
</ul>
