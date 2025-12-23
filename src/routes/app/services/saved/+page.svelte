<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade } from "svelte/transition";

	let { data } = $props();
</script>

<div class="max-w-5xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div
		class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
	>
		<div>
			<h1 class="text-3xl font-bold">⭐ Saved Providers</h1>
			<p class="text-gray-500">
				Your favorite mechanics, car washes, and services.
			</p>
		</div>
		<a
			href="/app/services/request"
			class="btn btn-primary btn-outline btn-sm"
		>
			Browse All Services
		</a>
	</div>

	{#if data.savedList.length === 0}
		<div
			class="text-center py-20 bg-base-200 rounded-xl border-dashed border-2 border-base-300"
		>
			<div class="text-6xl mb-4 opacity-30">🔖</div>
			<h3 class="text-xl font-bold opacity-60">No saved providers yet</h3>
			<p class="text-gray-500 mt-2">
				Bookmark providers when searching to find them here.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.savedList as provider (provider.id)}
				<div
					class="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200 group"
					transition:fade
				>
					<div class="card-body p-6">
						<div class="flex justify-between items-start mb-2">
							<div class="avatar placeholder">
								<div
									class="bg-neutral-focus text-neutral-content rounded-lg w-12 h-12 flex items-center justify-center text-2xl"
								>
									{provider.type === "CarWash"
										? "🚿"
										: provider.type === "Mechanic"
											? "🔧"
											: "🏗️"}
								</div>
							</div>

							<form
								method="POST"
								action="?/delete"
								use:enhance
							>
								<input
									type="hidden"
									name="id"
									value={provider.id}
								/>
								<button
									class="btn btn-ghost btn-circle btn-xs text-gray-400 hover:text-error tooltip tooltip-left"
									data-tip="Remove"
								>
									✕
								</button>
							</form>
						</div>

						<h2 class="card-title text-lg font-bold">
							{provider.name}
						</h2>
						<div
							class="badge badge-sm badge-outline opacity-70 mb-2"
						>
							{provider.type}
						</div>

						<div class="text-sm text-gray-500 space-y-1 mb-4">
							<p class="truncate">📍 {provider.address}</p>
							<p>📞 {provider.contactInfo}</p>
							<div
								class="flex items-center text-warning font-semibold"
							>
								★ {provider.rating ? provider.rating : "New"}
								<span class="text-gray-300 font-normal ml-1"
									>/ 5</span
								>
							</div>
						</div>

						<div
							class="card-actions justify-end mt-auto pt-4 border-t border-base-100"
						>
							<a
								href="/app/services/book/{provider.providerId}"
								class="btn btn-primary btn-sm w-full group-hover:bg-primary-focus"
							>
								Book Now
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
