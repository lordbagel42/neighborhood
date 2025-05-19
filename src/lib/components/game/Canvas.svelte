<script lang="ts">
	import type { Color } from 'colors/color';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	interface Props {
		clientId: string;
		supabase: SupabaseClient;
		drawColor: Color;
		backgroundColor: Color;
	}

	const {
		clientId,
		supabase,
		drawColor = $bindable(),
		backgroundColor = $bindable()
	}: Props = $props();

	let targetWidth = 100;
	let targetHeight = 100;

	let realWidth = 2000;
	let realHeight = 2000;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let isDrawing = false;
	let lastX: number | null = null;
	let lastY: number | null = null;
	let scaleX = 1;
	let scaleY = 1;

	// Draw a pixel at logical coordinates (pixelX, pixelY) with a color
	function drawPixel(pixelX: number, pixelY: number, color: string) {
		if (!ctx) return;
		ctx.fillStyle = color;
		ctx.fillRect(pixelX * scaleX, pixelY * scaleY, scaleX, scaleY);
	}

	// Paint a pixel (and interpolate if dragging) for local drawing
	function paintPixel(event: MouseEvent) {
		if (!ctx || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		const clickX = (event.clientX - rect.left) * (canvas.width / rect.width);
		const clickY = (event.clientY - rect.top) * (canvas.height / rect.height);
		const pixelX = Math.floor(clickX / scaleX);
		const pixelY = Math.floor(clickY / scaleY);

		if (lastX !== null && lastY !== null) {
			const dx = pixelX - lastX;
			const dy = pixelY - lastY;
			const steps = Math.max(Math.abs(dx), Math.abs(dy));
			for (let i = 0; i <= steps; i++) {
				const interpolatedX = Math.floor(lastX + (dx * i) / steps);
				const interpolatedY = Math.floor(lastY + (dy * i) / steps);
				drawPixel(interpolatedX, interpolatedY, drawColor.rgba.toString());
			}
		} else {
			drawPixel(pixelX, pixelY, drawColor.rgba.toString());
		}
		lastX = pixelX;
		lastY = pixelY;
	}

	// Paint a pixel for remote events (with interpolation if previous point exists for that client)
	// We'll track last remote position per clientId
	const remoteLastPos: Record<string, { x: number; y: number } | null> = {};

	function paintRemotePixel(clientId: string, pixelX: number, pixelY: number, color: string) {
		const last = remoteLastPos[clientId];
		if (last) {
			const dx = pixelX - last.x;
			const dy = pixelY - last.y;
			const steps = Math.max(Math.abs(dx), Math.abs(dy));
			for (let i = 0; i <= steps; i++) {
				const interpolatedX = Math.floor(last.x + (dx * i) / steps);
				const interpolatedY = Math.floor(last.y + (dy * i) / steps);
				drawPixel(interpolatedX, interpolatedY, color);
			}
		} else {
			drawPixel(pixelX, pixelY, color);
		}
		remoteLastPos[clientId] = { x: pixelX, y: pixelY };
	}

	function getPixelCoordinates(event: MouseEvent) {
		if (!canvas) return { canvasX: 0, canvasY: 0 };
		const rect = canvas.getBoundingClientRect();
		const clickX = (event.clientX - rect.left) * (canvas.width / rect.width);
		const clickY = (event.clientY - rect.top) * (canvas.height / rect.height);
		const pixelX = Math.floor(clickX / scaleX);
		const pixelY = Math.floor(clickY / scaleY);
		return { canvasX: pixelX, canvasY: pixelY };
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas dimensions to match the real dimensions
		canvas.width = realWidth;
		canvas.height = realHeight;
		scaleX = canvas.width / targetWidth;
		scaleY = canvas.height / targetHeight;

		// Fill the canvas with background color
		ctx.fillStyle = backgroundColor.hex.toString();
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const channel = supabase.channel('canvas-drawing');

		channel.on('broadcast', { event: 'canvas-drawing' }, (payload) => {
			const updated = payload.payload as {
				client_id: string;
				canvasX: number;
				canvasY: number;
				color: string;
			};

			// Don't draw your own events (optional, if you want to skip echo)
			// if (updated.client_id === clientId) return;

			// console.log('Canvas Drawing:', updated.client_id, updated.canvasX, updated.canvasY, updated.color);

			paintRemotePixel(updated.client_id, updated.canvasX, updated.canvasY, updated.color);
		});

		channel.subscribe((status) => {
			if (status === 'SUBSCRIBED') {
				console.log('Subscribed to canvas-drawing channel');
			}
		});

		// Add click event listener to update pixel color
		canvas.addEventListener('mousedown', (event) => {
			isDrawing = true;

			paintPixel(event);
			const { canvasX, canvasY } = getPixelCoordinates(event);
			channel.send({
				type: 'broadcast',
				event: 'canvas-drawing',
				payload: {
					client_id: clientId,
					canvasX,
					canvasY,
					color: drawColor.rgba.toString()
				}
			});
		});

		canvas.addEventListener('mousemove', (event) => {
			if (isDrawing) {
				paintPixel(event);
				const { canvasX, canvasY } = getPixelCoordinates(event);
				channel.send({
					type: 'broadcast',
					event: 'canvas-drawing',
					payload: {
						client_id: clientId,
						canvasX,
						canvasY,
						color: drawColor.rgba.toString()
					}
				});
			}
		});

		window.addEventListener('mouseup', () => {
			isDrawing = false;
			lastX = null;
			lastY = null;
		});

		canvas.addEventListener('mouseleave', () => {
			isDrawing = false;
			lastX = null;
			lastY = null;
		});

		// Reset remote drag state for all clients on mouseup anywhere (optional, for consistency)
		window.addEventListener('mouseup', () => {
			for (const key in remoteLastPos) remoteLastPos[key] = null;
		});
	});

	$effect(() => {
		if (!ctx) return;
		ctx.fillStyle = backgroundColor.rgba.toString();
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	});
</script>

<canvas class="h-full w-full" bind:this={canvas}></canvas>
