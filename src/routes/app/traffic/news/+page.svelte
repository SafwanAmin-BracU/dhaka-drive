<script lang="ts">
	import { fade } from "svelte/transition";

	let { data } = $props();

	// Helper to format the publication date
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};
</script>

<div class="max-w-3xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div class="mb-8 text-center md:text-left">
		<h1 class="text-3xl font-bold">📢 Traffic News & Updates</h1>
		<p class="text-gray-500">
			Official updates on road closures and daily traffic summaries.
		</p>
	</div>

	<div class="space-y-6">
		{#if data.news.length === 0}
			<div class="text-center py-12 bg-base-200 rounded-xl opacity-70">
				<div class="text-5xl mb-4">📰</div>
				<h3 class="text-lg font-bold">No News Yet</h3>
				<p>Check back later for traffic updates.</p>
			</div>
		{:else}
			{#each data.news as item (item.id)}
				<article
					class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all overflow-hidden"
					transition:fade
				>
					<div class="card-body">
						<div
							class="flex items-center justify-between text-xs text-gray-400 mb-2 uppercase tracking-wide font-bold"
						>
							<span class="flex items-center gap-1">
								🏛️ {item.source || "Official Source"}
							</span>
							<span>{formatDate(item.publishedAt!)}</span>
						</div>

						<h2
							class="card-title text-2xl font-bold text-gray-800 mb-2"
						>
							{item.title}
						</h2>
						<p
							class="text-gray-600 leading-relaxed whitespace-pre-line"
						>
							{item.content}
						</p>

						<div
							class="card-actions justify-end mt-4 pt-4 border-t border-base-100"
						>
							<button class="btn btn-ghost btn-xs text-primary"
								>Share Update</button
							>
						</div>
					</div>
				</article>
			{/each}
		{/if}
	</div>
</div>
