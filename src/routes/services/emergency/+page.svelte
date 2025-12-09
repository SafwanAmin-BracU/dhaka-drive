<script lang="ts">
	// SVELTE 5 RUNES SYNTAX
	
	// 1. Mock Data (Instead of DB for now)
	type Provider = { id: number; name: string; type: string; phone: string; location: string };
	
	const providers: Provider[] = [
		{ id: 1, name: "Dhaka Towing Pro", type: "Towing", phone: "01711-000000", location: "Gulshan" },
		{ id: 2, name: "Rahim's Mechanics", type: "Mechanic", phone: "01822-111111", location: "Mirpur 10" },
		{ id: 3, name: "BD Highway Police", type: "Hotline", phone: "999", location: "National" },
		{ id: 4, name: "City Ambulance", type: "Medical", phone: "106", location: "Dhanmondi" },
		{ id: 5, name: "Quick Fix Tyre", type: "Mechanic", phone: "01933-222222", location: "Banani" }
	];

	// 2. Reactivity with Runes
	let searchQuery = $state(""); // $state replaces 'let' variables
	
	// 3. Derived State (Filter logic)
	// $derived automatically updates when searchQuery changes
	let filteredProviders = $derived(
		providers.filter(p => 
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.type.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
	<header class="text-center space-y-2">
		<h1 class="text-3xl font-bold text-slate-800">Emergency Assistance</h1>
		<p class="text-slate-500">Find towing, mechanics, and hotlines near you.</p>
	</header>

	<div class="relative">
		<input 
			type="text" 
			placeholder="Search by name or service type (e.g., 'Mechanic')..." 
			bind:value={searchQuery}
			class="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#if filteredProviders.length > 0}
			{#each filteredProviders as provider}
				<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
					<div class="flex justify-between items-start">
						<div>
							<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
								{provider.type}
							</span>
							<h2 class="text-xl font-bold mt-2 text-slate-800">{provider.name}</h2>
							<p class="text-slate-500 text-sm flex items-center gap-1 mt-1">
								📍 {provider.location}
							</p>
						</div>
					</div>
					
					<div class="mt-4 pt-4 border-t border-slate-100">
						<a 
							href="tel:{provider.phone}" 
							class="flex items-center justify-center w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-700 transition"
						>
							📞 Call {provider.phone}
						</a>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-center text-slate-500 col-span-2">No providers found.</p>
		{/if}
	</div>
</div>