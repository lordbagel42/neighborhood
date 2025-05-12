<script lang="ts">
	interface Props {
		backgroundColor: string;
	}

	let { backgroundColor = $bindable() }: Props = $props();

	const setColor = (color: string) => {
		backgroundColor = color;
		console.log('Selected color:', backgroundColor);
	};
</script>

<div class="card bg-base-100 h-full w-full border-2 border-black shadow">
	<div class="card-body">
		<h2 class="card-title">Background</h2>
		<p style="color: {backgroundColor};">{backgroundColor}</p>
		<div class="grid grid-cols-5 gap-2">
			{#each ['black', 'white'] as color}
				<button
					class="btn btn-square"
					style="background-color: {color};"
					onclick={() => setColor(color)}
					aria-label="Select {color}"
				></button>
			{/each}
		</div>
	</div>
</div>
