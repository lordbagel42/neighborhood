<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../lib/database/supabaseClient';
	import { MousePointer2 } from '@lucide/svelte';
	import MouseTracker from '../lib/components/MouseTracker.svelte';

	let clientId = $state('');
	let showMouseTracker = $state(false);

	const CURSOR_OFFSET_X = 1;
	const CURSOR_OFFSET_Y = 120;
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
