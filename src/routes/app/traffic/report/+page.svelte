<script lang="ts">
	import { DefaultMarker, MapLibre, Popup } from "svelte-maplibre";
	import type { PageProps } from "./$types";
	import type { LngLat } from "maplibre-gl";

	let { data }: PageProps = $props();
	let selectedLongLat: [number, number] = $state([90.4152, 23.8041]);

	function selectMarker(x: number, y: number) {
		selectedLongLat = [x, y];
	}
</script>

<div class="grid grid-cols-2 h-[calc(100vh-156px)] w-full overflow-hidden">
	<div class="p-4 overflow-y-auto h-full">
		{#if data.incidents.length === 0}
			<p class="text-gray-600">No traffic incidents reported.</p>
		{:else}
			<ul class="space-y-3">
				{#each data.incidents as { location, isVerified, createdAt, description, id }}
					<button
						class={[
							"w-full text-left p-4 bg-white rounded-lg shadow cursor-pointer transition-colors hover:bg-gray-50",
							isVerified
								? "border-l-4 border-green-500"
								: "border-l-4 border-yellow-500",
							selectedLongLat[0] === location.x &&
							selectedLongLat[1] === location.y
								? "bg-gray-100"
								: "",
						]}
						onclick={() => selectMarker(location.x, location.y)}
					>
						<h3 class="text-lg font-semibold">Incident #{id}</h3>
						<p class="text-sm text-gray-500">
							{createdAt?.toLocaleString()}
						</p>
						<p class="mt-2">{description}</p>
					</button>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="relative w-full h-full">
		<MapLibre
			style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			class="absolute inset-0 w-full h-full"
			standardControls
			center={selectedLongLat}
			zoom={12}
		>
			{#each data.incidents as { location: { x, y }, id }}
				<DefaultMarker lngLat={[x, y]}>
					<Popup
						offset={[0, -10]}
						onopen={() => selectMarker(x, y)}
					>
						<div class="text-sm font-bold">Incident ID: {id}</div>
					</Popup>
				</DefaultMarker>
			{/each}
		</MapLibre>
	</div>
</div>
