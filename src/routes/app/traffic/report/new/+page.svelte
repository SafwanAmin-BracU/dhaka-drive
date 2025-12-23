<script lang="ts">
	import { enhance } from "$app/forms";

	// Svelte 5 Runes
	let loading = $state(false);
	let locationStatus = $state<"idle" | "locating" | "success" | "error">(
		"idle",
	);
	let lat = $state<number | null>(null);
	let lng = $state<number | null>(null);

	function getLocation() {
		locationStatus = "locating";
		if (!navigator.geolocation) {
			locationStatus = "error";
			return;
		}

		navigator.geolocation.getCurrentPosition(
			position => {
				lat = position.coords.latitude;
				lng = position.coords.longitude;
				locationStatus = "success";
			},
			() => {
				locationStatus = "error";
			},
		);
	}
</script>

<div
	class="max-w-lg mx-auto mt-10 p-6 card bg-base-100 shadow-xl border border-base-200"
>
	<div class="card-body">
		<h2 class="card-title text-2xl font-bold mb-4">
			📢 Report Traffic Incident
		</h2>

		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-4"
		>
			<div class="form-control">
				<label class="label">
					<span class="label-text font-semibold">Your Location</span>
					{#if locationStatus === "success"}
						<span class="badge badge-success text-white"
							>Located</span
						>
					{:else if locationStatus === "error"}
						<span class="badge badge-error text-white">Failed</span>
					{/if}
				</label>

				{#if !lat}
					<button
						type="button"
						onclick={getLocation}
						class="btn btn-outline btn-primary w-full"
						disabled={locationStatus === "locating"}
					>
						{#if locationStatus === "locating"}
							<span class="loading loading-spinner"></span> Locating...
						{:else}
							📍 Get Current Location
						{/if}
					</button>
				{:else}
					<div class="flex gap-2">
						<input
							type="text"
							name="lat"
							value={lat}
							class="input input-bordered w-full bg-base-200"
							readonly
						/>
						<input
							type="text"
							name="lng"
							value={lng}
							class="input input-bordered w-full bg-base-200"
							readonly
						/>
					</div>
					<button
						type="button"
						onclick={getLocation}
						class="btn btn-xs btn-ghost mt-1"
						>Retake Location</button
					>
				{/if}
			</div>

			<div class="form-control">
				<label
					class="label"
					for="status"
				>
					<span class="label-text font-semibold"
						>Traffic Condition</span
					>
				</label>
				<select
					name="status"
					class="select select-bordered w-full"
					required
				>
					<option
						disabled
						selected>Select status...</option
					>
					<option value="Heavy">🔴 Heavy Congestion</option>
					<option value="Moderate">🟡 Moderate Traffic</option>
					<option value="Clear">🟢 Clear Road</option>
				</select>
			</div>

			<div class="form-control">
				<label
					class="label"
					for="description"
				>
					<span class="label-text font-semibold"
						>Description (Optional)</span
					>
				</label>
				<textarea
					name="description"
					class="textarea textarea-bordered h-24"
					placeholder="e.g. Broken down truck blocking left lane..."
				></textarea>
			</div>

			<div class="form-control">
				<label
					class="label"
					for="image"
				>
					<span class="label-text font-semibold">Upload Photo</span>
				</label>
				<input
					type="file"
					name="image"
					accept="image/*"
					class="file-input file-input-bordered w-full"
				/>
			</div>

			<div class="card-actions justify-end mt-6">
				<button
					class="btn btn-primary w-full"
					disabled={loading || !lat}
				>
					{#if loading}
						<span class="loading loading-spinner"></span> Submitting...
					{:else}
						Submit Report
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
