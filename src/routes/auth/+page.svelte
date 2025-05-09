<script lang="ts">
	import { User, Mail, Lock, Slack, Github } from '@lucide/svelte';

	let { supabase } = $props();

	let isSignup = $state(false);

	async function signInWithSlack() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'slack_oidc'
		});
	}

	const loginFields = [
		{
			name: 'email',
			placeholder: 'Email',
			required: true,
			type: 'email',
			icon: Mail
		},
		{
			name: 'password',
			placeholder: 'Password',
			required: true,
			type: 'password',
			icon: Lock
		}
	];

	const signupFields = [
		...loginFields,
		{ name: 'firstName', placeholder: 'First Name', required: true, type: 'text', icon: User },
		{ name: 'lastName', placeholder: 'Last Name', required: true, type: 'text', icon: User }
	];

	const oidcProviders = [
		{ icon: Slack, onClick: signInWithSlack },
		{
			icon: Github,
			onClick: () => {
				console.log('GitHub login clicked');
			}
		}
	];

	let fields = $derived(isSignup ? signupFields : loginFields);
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="bg-base-300 w-full max-w-md rounded-2xl p-8 shadow-2xl">
		<h2 class="my-4 text-center text-2xl font-semibold">{isSignup ? 'Sign Up' : 'Login'}</h2>
		<div class="my-4 flex items-center justify-center gap-4">
			{#each oidcProviders as provider}
				<button
					type="button"
					class="btn btn-outline btn-primary text-base-content rounded-full p-3 transition hover:brightness-110"
					onclick={provider.onClick}
				>
					<provider.icon class="h-6 w-6" />
				</button>
			{/each}
		</div>
		<form method="POST" action={`?/${isSignup ? 'signup' : 'login'}`} class="space-y-4">
			{#each fields as field}
				<div class="relative">
					{#if field.icon}
						<field.icon
							class="text-base-content absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-70"
						/>
					{/if}
					<input
						name={field.name}
						type={field.type}
						class="bg-base-200 focus:ring-primary w-full rounded-xl py-2 pr-4 pl-10 transition focus:ring-2 focus:outline-none"
						placeholder={field.placeholder}
						required={field.required ?? false}
					/>
				</div>
			{/each}

			<button
				type="submit"
				class="bg-primary w-full rounded-xl py-2 font-semibold text-white transition hover:brightness-110"
			>
				{isSignup ? 'Create Account' : 'Login'}
			</button>
			<button
				type="button"
				class="text-primary my-2 w-full text-sm hover:underline"
				onclick={() => (isSignup = !isSignup)}
			>
				{isSignup ? 'Already have an account? Log in' : 'No account? Sign up'}
			</button>
		</form>
	</div>
</div>
