<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	import type { PageData } from './$types';

	let { data } = $props();
	let { notes, supabase, user } = $derived(data);

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (evt) => {
		evt.preventDefault();
		if (!evt.target) return;

		const form = evt.target as HTMLFormElement;

		const note = (new FormData(form).get('note') ?? '') as string;
		if (!note) return;

		const { error } = await supabase.from('notes').insert({ note });
		if (error) console.error(error);

		invalidate('supabase:db:notes');
		form.reset();
	};
</script>

<div
	class="dashboard bg-base-100/50 grid h-screen grid-cols-4 grid-rows-2 gap-4 rounded-lg p-8 shadow-lg backdrop-blur-md"
>
	<!-- Profile Picture and User Details -->
	<div
		class="bg-base-200/50 col-span-1 row-span-2 flex flex-col items-center justify-center rounded-lg p-4 shadow"
	>
		<div class="avatar mb-4 h-40 w-40">
			<img
				src="https://picsum.photos/200/300"
				alt="Profile Picture"
				class="border-base-300 rounded-full border-4 shadow"
			/>
		</div>
		<h2 class="text-primary text-lg font-semibold">{user?.user_metadata ?? 'User'}</h2>
		<h3 class="text-primary mt-4 text-lg font-semibold">User Details & Notes</h3>
		<ul class="text-base-content mt-2 list-disc pl-5">
			{#each notes as note}
				<li>{note.note}</li>
			{/each}
		</ul>
		<form onsubmit={handleSubmit} class="mt-4 w-full">
			<label class="input-group">
				<span>Add a note</span>
				<input name="note" type="text" class="input input-bordered w-full" />
			</label>
		</form>
	</div>

	<!-- Heatmap -->
	<div class="bg-base-200/50 row-span-1 w-auto rounded-lg p-4 shadow">
		<h3 class="text-primary text-lg font-semibold">Heatmap</h3>
		<p class="text-base-content text-base">Heatmap of where they most often place a pixel.</p>
	</div>

	<!-- Leaderboard -->
	<div class="bg-base-200/50 row-span-1 w-auto rounded-lg p-4 shadow">
		<h3 class="text-primary text-lg font-semibold">Leaderboard</h3>
		<p class="text-base-content text-base">Leaderboard about topic contributed to the most.</p>
	</div>

	<!-- Additional Content -->
	<div class="bg-base-200/50 col-span-3 row-span-1 rounded-lg p-4 shadow">
		<h3 class="text-primary text-lg font-semibold">Additional Content</h3>
		<p class="text-base-content text-base">Something else that fits here, I guess.</p>
	</div>
</div>
