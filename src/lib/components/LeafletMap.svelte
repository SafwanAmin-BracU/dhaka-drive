<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import L from "leaflet";
	export let markers: Array<{
		id: string;
		lat: number;
		lng: number;
		title: string;
		type: "traffic" | "parking" | "service";
	}> = [];

	let mapElement: HTMLElement;
	let map: L.Map;

	onMount(async () => {
		if (browser) {
			// 1. Initialize Map (Centered on Dhaka)
			map = L.map(mapElement).setView([23.8103, 90.4125], 13);

			// 2. Add OpenStreetMap Tile Layer
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "&copy; OpenStreetMap contributors",
			}).addTo(map);

			// 3. Custom Icons (Optional but recommended)
			const getIcon = (type: string) => {
				// You can use different colors for Traffic vs Parking
				return L.icon({
					iconUrl: `/icons/${type}-marker.png`, // Place pngs in static/icons/
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
				});
			};

			// 4. Render Markers
			markers.forEach(m => {
				L.marker([m.lat, m.lng]) // No icon set, using default for now
					.addTo(map)
					.bindPopup(`<b>${m.title}</b><br/>Type: ${m.type}`);
			});
		}
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div
	class="h-[600px] w-full rounded-lg shadow-lg z-0"
	bind:this={mapElement}
></div>

<style>
	/* Ensure map container has height */
	:global(.leaflet-container) {
		height: 100%;
		width: 100%;
		z-index: 0;
	}
</style>
