<script lang="ts">
	import { MapLibre, DefaultMarker, Popup } from "svelte-maplibre";
	import { enhance } from "$app/forms";

	let { data, form } = $props();

	// State
	let mapCenter = $state<[number, number]>([90.4125, 23.8103]);
	let zoom = $state(12);
	let selectedCategory = $state<string>("All");
	let selectedProvider = $state<(typeof data.providers)[0] | null>(null);

	// User Location State
	let userLocation = $state<{ lat: number; lng: number } | null>(null);
	let isLocating = $state(false);
	let loading = $state(false);

	// Derived: Filter providers based on category
	let filteredProviders = $derived(
		selectedCategory === "All"
			? data.providers
			: data.providers.filter(p => p.type === selectedCategory),
	);

	// Actions
	function getUserLocation() {
		isLocating = true;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				pos => {
					userLocation = {
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					};
					// Fly map to user
					mapCenter = [userLocation.lng, userLocation.lat];
					zoom = 14;
					isLocating = false;
				},
				err => {
					alert("Could not get location. Please enable GPS.");
					isLocating = false;
				},
			);
		}
	}

	function selectProvider(provider: (typeof data.providers)[0]) {
		selectedProvider = provider;
		mapCenter = [provider.location.x, provider.location.y];
		zoom = 15;
	}
</script>

<div
	class="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-64px)] overflow-hidden w-full"
>
	<div
		class="col-span-1 bg-base-100 flex flex-col border-r border-base-200 shadow-xl z-10 h-full"
	>
		<div class="p-6 border-b border-base-200">
			<h1 class="text-2xl font-bold text-error mb-4">
				🛠️ Request Assistance
			</h1>

			<div class="tabs tabs-boxed bg-base-200 p-1 gap-1">
				{#each ["All", "Mechanic", "Towing", "Fuel"] as category}
					<button
						class="tab {selectedCategory === category
							? 'tab-active'
							: ''}"
						onclick={() => (selectedCategory = category)}
					>
						{category}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex-1 overflow-y-auto p-6 space-y-6">
			<div class="card bg-base-100 border border-base-300">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm uppercase text-gray-500">
						Step 1: Your Location
					</h3>
					{#if !userLocation}
						<button
							class="btn btn-outline btn-primary w-full gap-2"
							onclick={getUserLocation}
							disabled={isLocating}
						>
							{#if isLocating}
								<span class="loading loading-spinner loading-xs"
								></span>
							{/if}
							📍 Detect My GPS
						</button>
						<p class="text-xs text-error mt-1">
							Required so help can reach you.
						</p>
					{:else}
						<div
							class="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
						>
							<span class="text-green-700 font-medium text-sm"
								>✅ Location Set</span
							>
							<button
								class="btn btn-xs btn-ghost"
								onclick={getUserLocation}>Update</button
							>
						</div>
					{/if}
				</div>
			</div>

			{#if !selectedProvider}
				<div>
					<h3 class="font-bold text-sm uppercase text-gray-500 mb-2">
						Step 2: Select a Provider
					</h3>
					<div class="space-y-2">
						{#each filteredProviders as provider}
							<button
								class="w-full text-left p-3 rounded-lg border border-base-200 hover:bg-base-200 transition-colors flex justify-between items-center group"
								onclick={() => selectProvider(provider)}
							>
								<div>
									<div class="font-bold">{provider.name}</div>
									<div class="text-xs text-gray-500">
										{provider.type} • ⭐ {provider.rating}/5
									</div>
								</div>
								<div
									class="btn btn-xs btn-ghost md:opacity-0 md:group-hover:opacity-100"
								>
									Select
								</div>
							</button>
						{/each}
						{#if filteredProviders.length === 0}
							<p class="text-gray-400 text-sm text-center py-4">
								No providers found for this category.
							</p>
						{/if}
					</div>
				</div>
			{/if}

			{#if selectedProvider}
				<div
					class="card bg-base-100 border-2 border-primary shadow-lg animate-in fade-in slide-in-from-bottom-4"
				>
					<div class="card-body p-4">
						<div class="flex justify-between items-start mb-2">
							<div>
								<h3 class="font-bold text-lg">
									{selectedProvider.name}
								</h3>
								<span
									class="badge badge-primary badge-outline text-xs"
									>{selectedProvider.type}</span
								>
							</div>
							<button
								class="btn btn-circle btn-xs btn-ghost"
								onclick={() => (selectedProvider = null)}
								>✕</button
							>
						</div>

						<form
							method="POST"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
							class="space-y-3"
						>
							<input
								type="hidden"
								name="providerId"
								value={selectedProvider.id}
							/>
							<input
								type="hidden"
								name="userLat"
								value={userLocation?.lat || ""}
							/>
							<input
								type="hidden"
								name="userLng"
								value={userLocation?.lng || ""}
							/>

							<div class="form-control">
								<label class="label p-0 mb-1"
									><span class="label-text text-xs font-bold"
										>What's the issue?</span
									></label
								>
								<textarea
									name="issueDescription"
									class="textarea textarea-bordered textarea-sm w-full"
									placeholder="e.g. Flat tire, engine smoking..."
									required
								></textarea>
							</div>

							<div class="alert alert-info text-xs py-2">
								<span
									>📞 They may call you at {selectedProvider.contactInfo}</span
								>
							</div>

							<button
								class="btn btn-primary w-full"
								disabled={!userLocation || loading}
							>
								{#if loading}
									<span class="loading loading-spinner"
									></span>
								{/if}
								Send Request
							</button>
						</form>
					</div>
				</div>
			{/if}

			{#if form?.success}
				<div
					role="alert"
					class="alert alert-success shadow-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path></svg
					>
					<div>
						<h3 class="font-bold">Request Sent!</h3>
						<div class="text-xs">
							Help is on the way. Check 'My Requests' for updates.
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="col-span-1 lg:col-span-2 relative h-full bg-gray-100">
		<MapLibre
			style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
			class="absolute inset-0 w-full h-full"
			standardControls
			bind:center={mapCenter}
			bind:zoom
		>
			{#if userLocation}
				<DefaultMarker lngLat={[userLocation.lng, userLocation.lat]}>
					<Popup offset={[0, -25]}>You are here</Popup>
				</DefaultMarker>
			{/if}

			{#each filteredProviders as provider}
				<DefaultMarker
					lngLat={[provider.location.x, provider.location.y]}
				>
					<Popup offset={[0, -25]}>
						<div class="text-center p-2">
							<h3 class="font-bold">{provider.name}</h3>
							<p class="text-xs">{provider.type}</p>
							<button
								class="btn btn-xs btn-primary mt-2"
								onclick={() => selectProvider(provider)}
							>
								Select
							</button>
						</div>
					</Popup>
				</DefaultMarker>
			{/each}
		</MapLibre>
	</div>
</div>
