<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade, slide } from "svelte/transition";

	let { data } = $props();
</script>

<div class="max-w-6xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div
		class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
	>
		<div>
			<h1 class="text-3xl font-bold">🛡️ Traffic Moderation</h1>
			<p class="text-gray-500">
				Verify user reports to ensure data accuracy.
			</p>
		</div>
		<div class="badge badge-lg badge-primary badge-outline">
			{data.pendingReports.length} Pending
		</div>
	</div>

	{#if data.pendingReports.length === 0}
		<div class="hero bg-base-200 rounded-xl py-20">
			<div class="hero-content text-center">
				<div class="max-w-md">
					<h1 class="text-5xl font-bold">All Clear!</h1>
					<p class="py-6">
						There are no pending reports to review at this time.
					</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.pendingReports as report (report.id)}
				<div
					class="card bg-base-100 shadow-lg border border-base-300 group"
					transition:fade
				>
					{#if report.imageUrl}
						<figure
							class="h-48 bg-gray-100 overflow-hidden relative"
						>
							<img
								src={report.imageUrl}
								alt="Traffic Report"
								class="object-cover w-full h-full"
							/>
							<div
								class="absolute bottom-2 right-2 badge badge-neutral opacity-90"
							>
								User Photo
							</div>
						</figure>
					{:else}
						<figure
							class="h-48 bg-base-200 flex items-center justify-center text-base-content/20"
						>
							<span class="text-6xl">📷</span>
						</figure>
					{/if}

					<div class="card-body p-6">
						<div class="flex justify-between items-start">
							<div
								class="badge {report.status === 'Heavy'
									? 'badge-error'
									: 'badge-warning'} text-white mb-2"
							>
								{report.status}
							</div>
							<div class="text-xs text-gray-400 font-mono">
								ID: #{report.id}
							</div>
						</div>

						<h2 class="card-title text-lg min-h-12 items-start">
							{report.description || "No description provided."}
						</h2>

						<div class="text-xs text-gray-500 mt-2 space-y-1">
							<p>
								📅 {new Date(
									report.createdAt!,
								).toLocaleString()}
							</p>
							<p>
								📍 Coordinates: {JSON.stringify(
									report.location,
								)}
							</p>
						</div>

						<div class="card-actions grid grid-cols-2 gap-3 mt-6">
							<form
								method="POST"
								action="?/reject"
								use:enhance
								class="w-full"
							>
								<input
									type="hidden"
									name="id"
									value={report.id}
								/>
								<button
									class="btn btn-outline btn-error btn-sm w-full"
								>
									Reject
								</button>
							</form>

							<form
								method="POST"
								action="?/verify"
								use:enhance
								class="w-full"
							>
								<input
									type="hidden"
									name="id"
									value={report.id}
								/>
								<button
									class="btn btn-success text-white btn-sm w-full"
								>
									Verify
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
