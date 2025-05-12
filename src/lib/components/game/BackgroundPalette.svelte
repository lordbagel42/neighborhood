<script lang="ts">
	import { Color } from 'colors/color';

	interface Props {
		backgroundColor: Color;
	}

	let { backgroundColor = $bindable() }: Props = $props();

	// const colorList = [
	// 	Color.fromName('red'),
	// 	Color.fromName('green'),
	// 	Color.fromName('red'),
	// 	Color.fromName('green'),
	// 	Color.fromName('blue')
	// ];

	const colorList = Object.entries(Color.colors).map(([name, rgba]) => {
		const [r, g, b] = rgba;
		return Color.fromRGB(r, g, b);
	});

	const setColor = (color: Color) => {
		backgroundColor = color;
		console.log('Selected color:', backgroundColor);
	};
</script>

<div class="card bg-base-100 h-full w-full border-2 border-black shadow">
	<div class="card-body">
		<h2 class="card-title">Background</h2>
		<p style="color: {backgroundColor};">{backgroundColor.closestName.name}</p>
		<div class="grid grid-cols-5 gap-2">
			{#each colorList as color}
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
