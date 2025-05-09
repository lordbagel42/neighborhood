<script lang="ts">
	import { onMount } from 'svelte';
	import { MousePointer2 } from '@lucide/svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	interface Props {
		clientId: string;
		CURSOR_OFFSET_X: number;
		CURSOR_OFFSET_Y: number;
		supabase: SupabaseClient;
		showMouseTracker: boolean;
	}

	let { clientId, CURSOR_OFFSET_X, CURSOR_OFFSET_Y, supabase, showMouseTracker } = $props();

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

	const myColor = getColorFromClientId(clientId);

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

<!-- 👤 Your own cursor -->
{#if showMouseTracker}
	<div
		class="client-box my-cursor"
		style="transform: translate({localX - CURSOR_OFFSET_X}px, {localY -
			CURSOR_OFFSET_Y}px); color: {myColor};"
		title="You"
	>
		<MousePointer2 fill={myColor} />
	</div>
{/if}

<!-- 🌍 Other users' cursors -->
{#each mousePositions as { client_id, x, y, color } (client_id)}
	<div
		class="client-box"
		style="transform: translate({x - CURSOR_OFFSET_X}px, {y - CURSOR_OFFSET_Y}px); color: {color};"
		title={`Client: ${client_id}`}
	>
		<MousePointer2 fill={color} />
	</div>
{/each}

<style>
	.client-box {
		position: absolute;
		width: 24px;
		height: 24px;
		pointer-events: none;
	}
	.my-cursor {
		filter: drop-shadow(0 0 2px white);
		opacity: 0.95;
	}
</style>
