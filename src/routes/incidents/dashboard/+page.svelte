<script lang="ts">

	let { data } = $props();
	let incidents = $derived(data.incidents);


	const getBadgeColor = (type: string) => {
		switch(type) {
			case 'Accident': return 'bg-rose-100 text-rose-800 border-rose-200';
			case 'Roadblock': return 'bg-amber-100 text-amber-800 border-amber-200';
			case 'Hazard': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default: return 'bg-slate-100 text-slate-800 border-slate-200';
		}
	};
</script>

<div class="py-4">
	<div class="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-4 gap-4">
		<div>
			<h1 class="text-3xl font-extrabold text-slate-900">Live Incidents</h1>
			<p class="text-slate-500 mt-1">Real-time updates from DhakaDrive users</p>
		</div>
<a href="/incidents/incident_report" class="btn bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm">
    <span class="text-xl leading-none">+</span> New Report
</a>
	</div>

	{#if incidents.length === 0}
		<div class="flex flex-col items-center justify-center py-20 text-center opacity-60">
			<div class="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
				<span class="text-4xl">🍃</span>
			</div>
			<h3 class="text-xl font-bold text-slate-700">All Clear!</h3>
			<p class="text-slate-500">No active incidents reported at the moment.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each incidents as incident (incident.id)}
				<div class="card bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200 rounded-xl overflow-hidden group">
					
					{#if incident.photoUrl}
						<figure class="h-48 overflow-hidden bg-slate-100 relative">
							<img 
								src={incident.photoUrl} 
								alt={incident.title} 
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
							<div class="absolute bottom-3 left-3">
								<span class={`badge border-none font-semibold shadow-sm ${getBadgeColor(incident.type)}`}>
									{incident.type}
								</span>
							</div>
						</figure>
					{:else}
						<div class="h-2 bg-slate-100 w-full relative">
							<div class="absolute -bottom-3 left-6">
								<span class={`badge border-none font-semibold shadow-sm ${getBadgeColor(incident.type)}`}>
									{incident.type}
								</span>
							</div>
						</div>
					{/if}

					<div class="card-body p-6">
						<div class="flex justify-between items-start mb-2">
							<h2 class="card-title text-lg font-bold text-slate-800 leading-tight">
								{incident.title}
							</h2>
						</div>

						<div class="flex items-start gap-2 text-sm text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-indigo-500 mt-0.5 shrink-0">
								<path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001.003.001zM7 9a3 3 0 116 0 3 3 0 01-6 0z" clip-rule="evenodd" />
							</svg>
							<span class="font-medium">{incident.location}</span>
						</div>

						<p class="text-slate-600 text-sm line-clamp-3 mb-4">
							{incident.description}
						</p>

						<div class="card-actions justify-between items-center mt-auto pt-4 border-t border-slate-100">
							<span class="text-xs font-medium text-slate-400">
								{new Date(incident.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>