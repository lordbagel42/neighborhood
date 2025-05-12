<script lang="ts">
	import MouseTracker from '$lib/components/MouseTracker.svelte';
	import Canvas from '$lib/components/game/Canvas.svelte';
	import ColorPalette from '$lib/components/game/Palette.svelte';
	import PromptInfo from '$lib/components/game/prompt/PromptInfo.svelte';
	import BackgroundPalette from '$lib/components/game/BackgroundPalette.svelte';

	let clientId = $state('');
	let showMouseTracker = $state(false);
	let clientCount = $state(0);

	const { data } = $props();
	let key = $state('');

	const supabase = $derived(data.supabase);
	const user = $derived(data.user);
	let signedIn = $derived.by(() => !!user);

	let drawColor = $state('#ff0000');
	let backgroundColor = $state('white');

	const CURSOR_OFFSET_X = 3;
	const CURSOR_OFFSET_Y = -45;

	$inspect(drawColor);
</script>

{#if !signedIn}
	<div class="m-4 flex flex-col items-center justify-center gap-2">
		<input
			type="text"
			placeholder="Enter your name"
			bind:value={clientId}
			class="input input-bordered w-64"
		/>
		<button
			class="btn btn-primary w-64"
			onclick={() => {
				if (clientId.trim()) {
					showMouseTracker = true;
				}
			}}
		>
			Start Tracking
		</button>
	</div>
{/if}

<MouseTracker
	{clientId}
	{CURSOR_OFFSET_X}
	{CURSOR_OFFSET_Y}
	{supabase}
	{showMouseTracker}
	{drawColor}
/>

<div class="mx-4 my-4 grid h-[calc(100vh-6rem)] grid-cols-12 grid-rows-12 justify-center gap-2">
	<!-- Left spacer -->
	<div class="col-span-3"></div>

	<!-- Center Canvas -->
	<div class="col-span-6 row-span-12 w-full">
		<Canvas bind:drawColor bind:backgroundColor />
	</div>

	<!-- Right color palette column -->
	<div class="col-span-3 row-span-12 grid grid-rows-subgrid gap-2">
		<!-- First color box: spans rows 1-6 -->

		<!-- Second color box: spans rows 7-12 -->
		<div class="row-span-2">
			<PromptInfo />
		</div>
		<div class="row-span-3">
			<ColorPalette bind:drawColor />
		</div>
		<div class="row-span-3">
			<BackgroundPalette bind:backgroundColor />
		</div>
	</div>
</div>

<style>
	.client-count {
		position: fixed;
		top: 10px;
		right: 10px;
		background: rgba(255, 255, 255, 0.8);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
