<script lang="ts">
	interface Props {
		drawColor: string;
	}

	let { drawColor = $bindable() }: Props = $props();

	const setColor = (color: string) => {
		drawColor = color;
		console.log('Selected color:', drawColor);
	};
</script>

<div class="card bg-base-100 h-full w-full border-2 border-black shadow">
	<div class="card-body">
		<h2 class="card-title">Draw</h2>
		<p style="color: {drawColor};">{drawColor}</p>
		<div class="grid grid-cols-5 gap-2">
			{#each ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#800080', '#FFA500', '#FFC0CB', '#A52A2A', '#000000', '#FFFFFF'] as color}
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
