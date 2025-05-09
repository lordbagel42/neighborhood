<script lang="ts">
	import { AppName } from '$lib/utils/constants';
	import { User } from '@lucide/svelte';

	const signedIn = false; // This should be replaced with actual authentication state

	const userDropdown = [
		{
			name: 'Profile',
			badge: '',
			link: '/user/profile'
		},
		{
			name: 'Settings',
			badge: '',
			link: '/user/settings'
		},
		{
			name: 'Logout',
			badge: '',
			link: '/user/logout'
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
					{#if signedIn}
						<User />
					{:else}
						<img
							alt="User Avatar"
							src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
						/>
					{/if}
					<img
						alt="User Avatar"
						src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
					/>
				</div>
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				{#each userDropdown as user}
					<li>
						<a href={user.link} class="flex items-center gap-2">
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
