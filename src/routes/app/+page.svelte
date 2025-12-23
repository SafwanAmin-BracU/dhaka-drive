<script lang="ts">
	import type { PageProps } from "./$types";
	import { DefaultMarker, MapEvents, MapLibre, Popup } from "svelte-maplibre";
	import type { LngLat, MapMouseEvent } from "maplibre-gl";

	let { data }: PageProps = $props();
	let spot: LngLat = $state();
</script>

<!-- <LeafletMap markers={[]} /> -->

<!-- <pre>
{JSON.stringify(data, null, 2)}
</pre> -->
<div class="h-[90vh] w-full">
	<MapLibre
		zoom={12}
		class="map"
		standardControls
		style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		antialias
		center={[90.4152, 23.8041]}
	>
		<!-- <MapEvents
	onclick={(event: MapMouseEvent) => {
		const { lngLat } = event;
		console.log("Map clicked at: ", lngLat);
		spot = lngLat;
		}}
		/>
	<DefaultMarker lngLat={spot}>
		<Popup offset={[0, -10]}>
			<div class="text-lg font-bold">Selected Spot</div>
			</Popup>
			</DefaultMarker> -->
		{#each data.parkingSpots as { location: { x, y }, name }}
			<DefaultMarker lngLat={[x, y]}>
				<Popup offset={[0, -10]}>
					<div class="text-sm">{name}</div>
				</Popup>
			</DefaultMarker>
		{/each}
	</MapLibre>
</div>

<style>
	:global(.map) {
		height: 100%;
		margin: 0;
	}
</style>
