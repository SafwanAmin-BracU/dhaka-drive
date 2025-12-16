<script lang="ts">
	import type { PageProps } from "./$types";
	import { enhance } from "$app/forms";

	let { data, form }: PageProps = $props();
</script>

<header class="mb-8">
	<h2 class="text-3xl font-extrabold text-slate-900">
		🅿️ Manual Parking Listings
	</h2>
	<p class="text-slate-600 mt-1">
		Add new available parking spots with details and slots.
	</p>
</header>

<hr class="mb-8 border-slate-200" />

<div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
	<div class="lg:col-span-1">
		<h3 class="text-xl font-bold text-slate-800 mb-4">Add New Spot</h3>

		{#if form?.success}
			<div
				class={`mb-4 p-3 rounded-lg border text-sm font-medium bg-green-100 text-green-700 border-green-300`}
			>
				{form.message}
			</div>
		{:else if form?.error}
			<div
				class={`mb-4 p-3 rounded-lg border text-sm font-medium bg-red-100 text-red-700 border-red-300`}
			>
				Error: {form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/createSpot"
			use:enhance
			class="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
		>
			<div class="space-y-4">
				<div>
					<label
						for="ownerId"
						class="block text-sm font-medium text-slate-700 mb-1"
						>Owner/Authority ID <span class="text-red-500">*</span
						></label
					>
					<input
						type="text"
						name="ownerId"
						id="ownerId"
						required
						value={form?.ownerId ?? ""}
						class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="e.g., Auth-101 or User-42"
					/>
				</div>

				<div>
					<label
						for="address"
						class="block text-sm font-medium text-slate-700 mb-1"
						>Full Address <span class="text-red-500">*</span></label
					>
					<input
						type="text"
						name="address"
						id="address"
						required
						value={form?.address ?? ""}
						class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="e.g., House 5A, Road 12, Gulshan"
					/>
				</div>

				<div>
					<label
						for="location"
						class="block text-sm font-medium text-slate-700 mb-1"
						>Area/Location Name <span class="text-red-500">*</span
						></label
					>
					<input
						type="text"
						name="location"
						id="location"
						required
						value={form?.location ?? ""}
						class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="e.g., Gulshan 2"
					/>
				</div>

				<div>
					<label
						for="slots"
						class="block text-sm font-medium text-slate-700 mb-1"
						>Available Slots</label
					>
					<input
						type="number"
						name="slots"
						id="slots"
						min="1"
						value={form?.slots ?? ""}
						class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="e.g., 5"
					/>
				</div>

				<div>
					<label
						for="additionalInfo"
						class="block text-sm font-medium text-slate-700 mb-1"
						>Additional Information</label
					>
					<textarea
						name="additionalInfo"
						id="additionalInfo"
						rows="3"
						class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="e.g., Monthly parking available, Max height 2.2m"
						>{form?.additionalInfo ?? ""}</textarea
					>
				</div>

				<button
					type="submit"
					class="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
				>
					Add Parking Spot
				</button>
			</div>
		</form>
	</div>

	<div class="lg:col-span-2">
		<h3 class="text-xl font-bold text-slate-800 mb-4">
			Existing Parking Spots
		</h3>

		<div class="space-y-4">
			{#each data.parkingSpots as spot (spot.id)}
				<div
					class="bg-white p-5 rounded-xl shadow border border-slate-200"
				>
					<div class="flex justify-between items-start">
						<h4 class="text-lg font-semibold text-indigo-700">
							{spot.location}
						</h4>
						<span
							class="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
						>
							Owner: {spot.ownerId}
						</span>
					</div>
					<p class="text-sm text-slate-700 mt-1">
						{spot.address}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>
