<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { DefaultMarker, MapLibre, Popup } from "svelte-maplibre";

	let { data } = $props();

	// Map state
	let mapCenter = $state<[number, number]>([90.4125, 23.8103]); // Default Dhaka
	let zoom = $state(12);

	// Interaction: Fly to marker when list item is clicked
	function focusSpot(x: number, y: number) {
		mapCenter = [x, y];
		zoom = 15;
	}

	// Filter Toggle Handling
	function toggleFilter(e: Event) {
		const checked = (e.target as HTMLInputElement).checked;
		const url = new URL(page.url);
		if (checked) url.searchParams.set("available", "true");
		else url.searchParams.delete("available");
		goto(url, { keepFocus: true });
	}

	// Real-time updates (Polling)
	onMount(() => {
		const interval = setInterval(() => {
			invalidate("app:parking-available"); // Refetches 'load' function
		}, 9000); // 9 seconds (9ms would freeze the browser)

		return () => clearInterval(interval);
	});
</script>

<div
	class="w-full h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-3 overflow-hidden"
>
	<div
		class="col-span-1 h-full flex flex-col bg-base-100 border-r border-base-200 min-h-0"
	>
		<div
			class="p-4 border-b border-base-200 bg-base-100 z-10 shadow-sm flex-none"
		>
			<h1 class="text-xl font-bold mb-2">🅿️ Parking Locator</h1>
			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-3">
					<input
						type="checkbox"
						class="toggle toggle-success toggle-sm"
						checked={page.url.searchParams.get("available") ===
							"true"}
						onchange={toggleFilter}
					/>
					<span class="label-text font-medium"
						>Show Available Only</span
					>
				</label>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
			{#if data.spots.length === 0}
				<div class="alert alert-warning">No parking spots found.</div>
			{:else}
				{#each data.spots as spot}
					<button
						class="w-full text-left card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-all hover:bg-base-200 group"
						onclick={() =>
							focusSpot(spot.location.x, spot.location.y)}
					>
						<div class="card-body p-4">
							<div class="flex justify-between items-start">
								<h3 class="font-bold text-lg">{spot.name}</h3>
								<div
									class={`badge ${spot.isAvailable ? "badge-success text-white" : "badge-error text-white"}`}
								>
									{spot.isAvailable ? "OPEN" : "FULL"}
								</div>
							</div>

							<p
								class="text-sm text-gray-500 flex items-center gap-1"
							>
								📍 {spot.address}
							</p>

							<div class="flex gap-4 mt-3 text-sm">
								<div class="flex flex-col">
									<span
										class="text-xs text-gray-400 uppercase"
										>Capacity</span
									>
									<span class="font-semibold"
										>{spot.totalSlots} Slots</span
									>
								</div>
								<div class="flex flex-col">
									<span
										class="text-xs text-gray-400 uppercase"
										>Rate</span
									>
									<span class="font-semibold"
										>{spot.pricePerHour}৳ /hr</span
									>
								</div>
							</div>

							<div
								class="card-actions justify-end mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
							>
								<span class="btn btn-xs btn-primary"
									>View on Map</span
								>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<div class="col-span-1 md:col-span-2 relative h-full w-full bg-gray-100">
		<MapLibre
			style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
			class="absolute inset-0 w-full h-full"
			standardControls
			bind:center={mapCenter}
			bind:zoom
		>
			{#each data.spots as spot}
				<DefaultMarker
					lngLat={[Number(spot.location.x), Number(spot.location.y)]}
				>
					<Popup offset={[0, -25]}>
						<div class="text-center p-2">
							<h3 class="font-bold">{spot.name}</h3>
							<p class="text-xs mb-2">{spot.address}</p>
							<div
								class={`badge ${spot.isAvailable ? "badge-success" : "badge-error"} text-white mb-2`}
							>
								{spot.isAvailable ? "Available" : "Full"}
							</div>
							<a
								href="/app/parking/book/{spot.id}"
								class="btn btn-xs btn-outline btn-primary w-full"
							>
								Book Slot
							</a>
						</div>
					</Popup>
				</DefaultMarker>
			{/each}
		</MapLibre>
	</div>
</div>
