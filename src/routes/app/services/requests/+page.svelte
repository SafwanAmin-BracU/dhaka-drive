<script lang="ts">
	import { fade } from "svelte/transition";

	let { data } = $props();

	const formatDate = (d: Date) =>
		new Date(d).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
</script>

<div class="max-w-3xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">🆘 Assistance History</h1>
		<p class="text-gray-500">
			Log of your immediate roadside help requests.
		</p>
	</div>

	<div class="space-y-4">
		{#if data.requestHistory.length === 0}
			<div class="text-center py-16 bg-base-200 rounded-xl">
				<div class="text-5xl mb-4 opacity-30">🛣️</div>
				<h3 class="text-lg font-bold opacity-60">No history found</h3>
				<p class="text-gray-500">
					You haven't requested roadside assistance yet.
				</p>
				<a
					href="/app/services/request"
					class="btn btn-primary btn-sm mt-4">Request Help</a
				>
			</div>
		{:else}
			{#each data.requestHistory as req (req.id)}
				<div
					class="card bg-base-100 shadow-sm border border-base-200"
					transition:fade
				>
					<div class="card-body p-5">
						<div class="flex justify-between items-start">
							<div>
								<h2
									class="font-bold text-lg flex items-center gap-2"
								>
									{req.issue}
								</h2>
								<p class="text-xs text-gray-400 mt-1">
									{req.createdAt
										? formatDate(req.createdAt)
										: "N/A"}
								</p>
							</div>

							<div
								class="badge {req.status === 'Completed'
									? 'badge-neutral'
									: req.status === 'Cancelled'
										? 'badge-error text-white'
										: req.status === 'Accepted'
											? 'badge-success text-white'
											: 'badge-warning'} badge-lg"
							>
								{req.status}
							</div>
						</div>

						{#if req.providerName}
							<div
								class="mt-4 pt-4 border-t border-base-100 flex items-center gap-3"
							>
								<div class="avatar placeholder">
									<div
										class="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center"
									>
										🏗️
									</div>
								</div>
								<div>
									<p class="text-sm font-bold">
										{req.providerName}
									</p>
									<p class="text-xs text-gray-500">
										{req.providerType}
									</p>
								</div>
								<div class="ml-auto">
									{#if req.status === "Accepted"}
										<a
											href="tel:{req.contactInfo}"
											class="btn btn-xs btn-success text-white"
										>
											Call Now
										</a>
									{/if}
								</div>
							</div>
						{:else if req.status === "Pending"}
							<div
								class="mt-4 pt-4 border-t border-base-100 flex items-center gap-2 text-warning"
							>
								<span class="loading loading-spinner loading-xs"
								></span>
								<span class="text-sm italic"
									>Searching for nearby providers...</span
								>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
