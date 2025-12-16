<script lang="ts">
	let { data } = $props();
	let incidents = $derived(data.incidents);
</script>

<div class="min-h-screen bg-base-200 p-4 md:p-8">
	<div class="flex flex-col md:flex-row justify-between items-center mb-8 max-w-7xl mx-auto">
		<h1 class="text-4xl font-bold text-primary">Incident Dashboard</h1>
		<a href="/incidents" class="btn btn-outline mt-4 md:mt-0">
			&larr; Back to Report
		</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
		{#each incidents as incident (incident.id)}
			<div class="card bg-base-100 shadow-xl border border-base-200">
				{#if incident.photoUrl}
					<figure class="h-48">
						<img src={incident.photoUrl} alt={incident.title} class="w-full h-full object-cover" />
					</figure>
				{:else}
					<figure class="h-48 bg-neutral text-neutral-content flex items-center justify-center">
						<span class="text-sm">No Image</span>
					</figure>
				{/if}

				<div class="card-body">
					<div class="flex justify-between items-start gap-2">
						<h2 class="card-title text-lg">{incident.title}</h2> <div class="badge badge-accent badge-outline">{incident.type}</div>
					</div>

					<div class="flex items-center gap-2 text-sm text-base-content/70 my-2">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-error">
							<path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001.003.001zM7 9a3 3 0 116 0 3 3 0 01-6 0z" clip-rule="evenodd" />
						</svg>
						{incident.location}
					</div>

					<p class="text-sm">{incident.description}</p>
					
					<div class="card-actions justify-end mt-4">
						<div class="badge badge-ghost text-xs">
							{new Date(incident.createdAt).toLocaleDateString()}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>