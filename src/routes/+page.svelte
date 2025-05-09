<script>
	import Login from './../lib/components/auth/Login.svelte';
	let { data } = $props();
	let { colors } = $derived(data);
</script>

<Login />
