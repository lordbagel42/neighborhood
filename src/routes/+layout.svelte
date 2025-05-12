<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { themeChange } from 'theme-change';

	let { data, children } = $props();
	let { session, supabase, user } = $derived(data);

	onMount(() => {
		// themeChange(false);

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Navbar {session} {supabase} {user} />

{@render children()}
