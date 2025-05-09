<script lang="ts">
	import { AppName } from '$lib/utils/constants';
	import type { Session } from '@supabase/supabase-js';
	import { supabase } from '$lib/database/supabaseClient';

	interface Props {
		session: Session | null;
	}

	const { session }: Props = $props();

	const signedIn = session?.user !== undefined;

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		console.log('Logging out...');
		if (error) {
			console.error(error);
		}
	};

	const userDropdown = [
		{
			name: 'Profile',
			badge: '',
			link: '/user/profile',
			onclick: undefined
		},
		{
			name: 'Settings',
			badge: '',
			link: '/user/settings',
			onclick: undefined
		},
		{
			name: signedIn ? 'Logout' : 'Login',
			badge: '',
			link: undefined,
			onclick: signedIn ? () => logout() : undefined
		}
	];
</script>

<div class="navbar bg-base-100 shadow-sm">
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
						<img
							alt="User Avatar"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11c2VyLWljb24gbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+"
						/>
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
						<a href={user.link} class="flex items-center gap-2" onclick={user.onclick}>
							{user.name}
							{#if user.badge}
								<span class="badge badge-xs">{user.badge}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
