<script lang="ts">
	import { onMount } from 'svelte';
	import { MousePointer2 } from '@lucide/svelte';
	import Portal from 'svelte-portal';
	import type { SupabaseClient } from '@supabase/supabase-js';

	interface Props {
		clientId: string;
		CURSOR_OFFSET_X: number;
		CURSOR_OFFSET_Y: number;
		supabase: SupabaseClient;
		showMouseTracker: boolean;
		myColor: string;
	}

	let { clientId, CURSOR_OFFSET_X, CURSOR_OFFSET_Y, supabase, showMouseTracker, myColor } =
		$props();

	let mousePositions: {
		client_id: string;
		x: number;
		y: number;
		color: string;
		lastUpdated: number;
	}[] = $state([]);

	let localX = $state(0);
	let localY = $state(0);

	const getColorFromClientId = (client_id: string) => {
		let hash = 0;
		for (let i = 0; i < client_id.length; i++) {
			hash = client_id.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = Math.abs(hash) % 360;
		return `hsl(${hue}, 80%, 60%)`;
	};

	onMount(() => {
		const channel = supabase.channel('mouse-positions');

		channel.on('broadcast', { event: 'mouse-move' }, (payload) => {
			const updated = payload.payload as {
				client_id: string;
				x: number;
				y: number;
			};

			if (updated.client_id === clientId) return;

			const now = Date.now();
			const existing = mousePositions.find((p) => p.client_id === updated.client_id);

			if (existing) {
				existing.x = updated.x;
				existing.y = updated.y;
				existing.lastUpdated = now;
				mousePositions = [...mousePositions];
			} else {
				mousePositions = [
					...mousePositions,
					{
						...updated,
						color: getColorFromClientId(updated.client_id),
						lastUpdated: now
					}
				];
			}
		});

		channel.subscribe();

		const THROTTLE_MS = 0;
		let lastSent = 0;

		const handleMouseMove = (event: MouseEvent) => {
			// console.log('Mouse Position:', event.clientX, event.clientY);
			localX = event.clientX;
			localY = event.clientY;

			const now = Date.now();
			if (showMouseTracker) {
				if (now - lastSent > THROTTLE_MS) {
					lastSent = now;
					channel.send({
						type: 'broadcast',
						event: 'mouse-move',
						payload: {
							client_id: clientId,
							x: localX,
							y: localY
						}
					});
				}
			}
		};

		document.addEventListener('mousemove', handleMouseMove);

		const cleanupInterval = setInterval(() => {
			const cutoff = Date.now() - 10000;
			mousePositions = mousePositions.filter((p) => p.lastUpdated > cutoff);
		}, 2000);

		return () => {
			channel.unsubscribe();
			document.removeEventListener('mousemove', handleMouseMove);
			clearInterval(cleanupInterval);
		};
	});
</script>

<Portal target="body">
	{#if showMouseTracker}
		<div
			class="client-box my-cursor"
			style="transform: translate3d({Math.round(localX - CURSOR_OFFSET_X)}px, {Math.round(
				localY - CURSOR_OFFSET_Y - window.innerHeight
			)}px, 0);"
			title="You"
		>
			<MousePointer2 fill={myColor} />
			<span class="font-xl rounded-5 rounded bg-white p-2 font-bold" style="color: {myColor}">
				{clientId}
			</span>
		</div>
	{/if}

	{#each mousePositions as { client_id, x, y, color } (client_id)}
		<div
			class="client-box"
			style="transform: translate3d({Math.round(localX - CURSOR_OFFSET_X)}px, {Math.round(
				localY - CURSOR_OFFSET_Y - window.innerHeight
			)}px, 0);"
			title={`Client: ${client_id}`}
		>
			<MousePointer2 fill={color} />
			<span style="color: {color}; font-weight: bold; font-size: 0.8rem;">
				{client_id}
			</span>
		</div>
	{/each}
</Portal>

<style>
	.client-box {
		position: absolute !important; /* Ensure it's rendered on top */
		width: 24px;
		height: 24px;
		pointer-events: none;
		will-change: transform;
	}
	.my-cursor {
		filter: drop-shadow(0 0 2px white);
		opacity: 0.95;
	}
</style>
