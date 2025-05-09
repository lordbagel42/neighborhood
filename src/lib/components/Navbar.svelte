<script lang="ts">
	import { AppName } from '$lib/utils/constants';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { Sun, Moon, User } from '@lucide/svelte';

	interface Props {
		session: Session | null;
		supabase: SupabaseClient;
	}

	const { session, supabase }: Props = $props();

	const signedIn = session?.user !== undefined;

	const logout = async () => {
		console.log('Logging out...');
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			console.log('Logged out successfully');
			location.reload();
		}
	};

	const userDropdown = [
		{
			name: 'Profile',
			badge: '',
			link: '/user/profile',
			type: 'link'
		},
		{
			name: 'Settings',
			badge: '',
			link: '/user/settings',
			type: 'link'
		},
		{
			name: signedIn ? 'Logout' : 'Login',
			badge: '',
			type: signedIn ? 'button' : 'link',
			link: signedIn ? undefined : '/auth',
			onclick: signedIn ? () => logout() : undefined
		}
	];

	let mode = $state<'dracula' | 'emerald'>('emerald');

	const applyTheme = (theme: string) => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	};

	onMount(() => {
		const stored = localStorage.getItem('theme') as 'emerald' | 'dracula' | null;
		if (stored) {
			mode = stored;
		}
		applyTheme(mode);
	});

	const toggleTheme = () => {
		mode = mode === 'dracula' ? 'emerald' : 'dracula';
		applyTheme(mode);
	};
	onMount(() => {
		console.log(signedIn);
	});
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<button class="btn btn-ghost btn-circle" onclick={toggleTheme} aria-label="Toggle Theme">
			{#if mode === 'dracula'}
				<Moon class="h-[1.2rem] w-[1.2rem]" />
			{:else}
				<Sun class="h-[1.2rem] w-[1.2rem]" />
			{/if}
		</button>
	</div>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">{AppName}</a>
	</div>
	<div class="flex gap-2">
		<input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					{#if !signedIn}
						<!-- black magic svg thing -->
						<User class="h-full w-full" />
					{:else}
						<img
							alt="User Avatar"
							src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
						/>
					{/if}
				</div>
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				{#each userDropdown as user}
					<li>
						{#if user.type === 'button'}
							<button onclick={user.onclick} class="flex w-full items-center gap-2 text-left">
								{user.name}
								{#if user.badge}
									<span class="badge badge-xs">{user.badge}</span>
								{/if}
							</button>
						{:else}
							<a href={user.link} class="flex items-center gap-2">
								{user.name}
								{#if user.badge}
									<span class="badge badge-xs">{user.badge}</span>
								{/if}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
