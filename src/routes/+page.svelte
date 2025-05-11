<script lang="ts">
	import MouseTracker from '../lib/components/MouseTracker.svelte';
	import Canvas from '$lib/components/game/Canvas.svelte';

	let clientId = $state('');
	let showMouseTracker = $state(false);
	let clientCount = $state(0);

	const { data } = $props();
	let key = $state('');

	const supabase = $derived(data.supabase);
	let signedIn = $state(false);

	const getColorFromClientId = (client_id: string) => {
		let hash = 0;
		for (let i = 0; i < client_id.length; i++) {
			hash = client_id.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = Math.abs(hash) % 360;
		return `hsl(${hue}, 80%, 60%)`;
	};
	const myColor = $derived.by(() => getColorFromClientId(clientId || crypto.randomUUID()));

	supabase.auth.getUser().then(({ data }) => {
		if (data.user) {
			signedIn = true;
			showMouseTracker = true;
			clientId = data.user.user_metadata.display_name || data.user.id;
		} else {
			signedIn = false;
			showMouseTracker = false;
			clientId = '';
		}
	});

	const CURSOR_OFFSET_X = 3;
	const CURSOR_OFFSET_Y = -45;
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
			on:click={() => {
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
	{myColor}
/>

<div class="mt-4 flex h-[calc(100vh-8rem)] items-center justify-center">
	<div class="aspect-square w-full max-w-[calc(100vh-8rem)] p-4">
		<input
			type="text"
			placeholder="Enter a key"
			bind:value={key}
			class="input input-bordered mb-4 w-full"
		/>
		<Canvas {myColor} {key} />
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
