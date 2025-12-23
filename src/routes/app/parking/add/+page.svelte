<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
	import { enhance } from "$app/forms";
	import { MapLibre, Marker, NavigationControl } from "svelte-maplibre";
	import type { LngLat, MapMouseEvent } from "maplibre-gl";
	let { form } = $props();

	// State using Svelte 5 Runes
	let loading = $state(false);
	let mapCenter = $state<[number, number]>([90.4125, 23.8103]); // Default Dhaka
	let markerLocation = $state<{ lat: number; lng: number } | null>(null);

	// Handle map click to set location
	function handleMapClick(e: MapMouseEvent) {
		const { lng, lat } = e.lngLat;
		markerLocation = { lng, lat };
	}
</script>

<div
	class="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-64px)] overflow-hidden"
>
	<div class="h-full overflow-y-auto p-6 lg:p-10 bg-base-100 shadow-xl z-10">
		<div class="max-w-md mx-auto">
			<h1 class="text-3xl font-bold mb-2">➕ Add Parking Spot</h1>
			<p class="text-gray-500 mb-8">
				Register a new parking location for users to find.
			</p>

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="space-y-4"
			>
				<input
					type="hidden"
					name="lat"
					value={markerLocation?.lat ?? ""}
				/>
				<input
					type="hidden"
					name="lng"
					value={markerLocation?.lng ?? ""}
				/>

				<div class="form-control">
					<label class="label"
						><span class="label-text font-bold">Parking Name</span
						></label
					>
					<input
						type="text"
						name="name"
						placeholder="e.g. Pink City Basement 1"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label"
						><span class="label-text font-bold">Full Address</span
						></label
					>
					<input
						type="text"
						name="address"
						placeholder="e.g. Plot 15, Gulshan Ave"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label"
							><span class="label-text font-bold"
								>Total Slots</span
							></label
						>
						<input
							type="number"
							name="totalSlots"
							placeholder="50"
							class="input input-bordered w-full"
							required
							min="1"
						/>
					</div>

					<div class="form-control">
						<label class="label"
							><span class="label-text font-bold"
								>Price (৳/hr)</span
							></label
						>
						<input
							type="number"
							name="pricePerHour"
							placeholder="40"
							class="input input-bordered w-full"
							min="0"
						/>
					</div>
				</div>

				<div
					class="alert mt-4 {markerLocation
						? 'alert-success'
						: 'alert-warning'} text-sm py-2"
				>
					{#if markerLocation}
						<span
							>✅ Location Pin Set: {markerLocation.lat.toFixed(
								4,
							)}, {markerLocation.lng.toFixed(4)}</span
						>
					{:else}
						<span
							>📍 Please click on the map to pin the location.</span
						>
					{/if}
				</div>

				<button
					class="btn btn-primary w-full mt-6"
					disabled={loading || !markerLocation}
				>
					{#if loading}
						<span class="loading loading-spinner"></span>
					{/if}
					Register Parking Spot
				</button>

				{#if form?.message}
					<div
						role="alert"
						class="alert alert-error mt-4"
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
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path></svg
						>
						<span>{form.message}</span>
					</div>
				{/if}
			</form>
		</div>
	</div>

	<div class="h-full relative bg-gray-100">
		<MapLibre
			style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
			class="absolute inset-0 w-full h-full"
			standardControls
			bind:center={mapCenter}
			zoom={12}
			onclick={handleMapClick}
		>
			<NavigationControl position="top-right" />

			{#if markerLocation}
				<Marker lngLat={[markerLocation.lng, markerLocation.lat]}>
					<div class="text-4xl drop-shadow-lg -mt-10 animate-bounce">
						📍
					</div>
				</Marker>
			{/if}
		</MapLibre>

		<div
			class="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-md z-10 pointer-events-none"
		>
			<p class="text-sm font-medium">
				Click anywhere on the map to set the parking location.
			</p>
		</div>
	</div>
</div>
