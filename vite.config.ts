import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'raygen-rupe',
				project: 'neighborhood'
			},
			autoUploadSourceMaps: true
		}),
		tailwindcss(),
		sveltekit()
	]
});
