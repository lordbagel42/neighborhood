<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../lib/database/supabaseClient';
	import { MousePointer2 } from '@lucide/svelte';
	import MouseTracker from '../lib/components/MouseTracker.svelte';

	let clientId = $state('');
	let showMouseTracker = $state(false);
	let clientCount = $state(0);

	const CURSOR_OFFSET_X = 1;
	const CURSOR_OFFSET_Y = 120;

	onMount(() => {
		const channel = supabase.channel('mouse-positions');

		channel.on('broadcast', { event: 'client-count' }, (payload) => {
			clientCount = payload.payload.count;
		});

		channel.subscribe();

		return () => {
			channel.unsubscribe();
		};
	});
</script>

<input
	type="text"
	placeholder="Enter your name"
	bind:value={clientId}
	class="input input-bordered mx-2 my-2"
/>
<button
	class="btn btn-primary mx-2 my-2"
	onclick={() => {
		if (clientId.trim()) {
			showMouseTracker = true;
		}
	}}
>
	Start Tracking
</button>

<MouseTracker {clientId} {CURSOR_OFFSET_X} {CURSOR_OFFSET_Y} {supabase} {showMouseTracker} />

<!-- Display the client count -->
<div class="client-count text-primary font-bold">
	Connected Clients: {clientCount}
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
