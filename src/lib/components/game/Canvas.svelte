<script lang="ts">
	import { onMount } from 'svelte';
	import type { Settings } from './gameTypes';

	interface Props {
		settings: Settings;
	}

	const { settings }: Props = $props();

	let targetWidth = 100;
	let targetHeight = 100;

	let realWidth = 2000;
	let realHeight = 2000;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	let isDrawing = false;

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas dimensions to match the real dimensions
		canvas.width = realWidth;
		canvas.height = realHeight;

		// Calculate scaling factors based on the target and real dimensions
		const scaleX = canvas.width / targetWidth;
		const scaleY = canvas.height / targetHeight;

		// Fill the canvas with seeded random colors based on the key
		ctx.fillStyle = settings.backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const paintPixel = (event: MouseEvent) => {
			if (!ctx || !canvas) return;

			const rect = canvas.getBoundingClientRect();
			const clickX = (event.clientX - rect.left) * (canvas.width / rect.width);
			const clickY = (event.clientY - rect.top) * (canvas.height / rect.height);

			// Calculate the pixel coordinates based on the click position
			const pixelX = Math.floor(clickX / scaleX);
			const pixelY = Math.floor(clickY / scaleY);

			// Update the clicked pixel's color
			ctx.fillStyle = settings.drawColor;
			ctx.fillRect(pixelX * scaleX, pixelY * scaleY, scaleX, scaleY);
		};

		// Add click event listener to update pixel color
		canvas.addEventListener('mousedown', (event) => {
			isDrawing = true;
			paintPixel(event);
		});

		canvas.addEventListener('mousemove', (event) => {
			if (isDrawing) {
				paintPixel(event);
			}
		});

		window.addEventListener('mouseup', () => {
			isDrawing = false;
		});

		canvas.addEventListener('mouseleave', () => {
			isDrawing = false;
		});
	});
</script>

<canvas class="h-full w-full" bind:this={canvas}></canvas>
