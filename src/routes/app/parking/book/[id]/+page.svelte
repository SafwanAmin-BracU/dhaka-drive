<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";

	let { data, form } = $props();

	// State for calculation
	let startTime = $state("");
	let endTime = $state("");
	let loading = $state(false);

	// Derived: Calculate Total Cost automatically
	let totalCost = $derived.by(() => {
		if (!startTime || !endTime) return 0;
		const start = new Date(startTime);
		const end = new Date(endTime);

		if (start >= end) return 0;

		const diffMs = end.getTime() - start.getTime();
		const diffHours = diffMs / (1000 * 60 * 60);

		return Math.ceil(diffHours) * (data.spot.pricePerHour || 0);
	});

	// Helper to format Date for input[type="datetime-local"]
	// Ensures user can't pick past dates easily
	const minDate = new Date().toISOString().slice(0, 16);
</script>

<div
	class="min-h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center p-4"
>
	<div
		class="card lg:card-side bg-base-100 shadow-xl max-w-4xl w-full overflow-hidden"
	>
		<figure
			class="lg:w-1/2 bg-neutral text-neutral-content relative flex flex-col items-center justify-center p-8"
		>
			<div class="text-6xl mb-4">🅿️</div>
			<h2 class="card-title text-3xl font-bold">{data.spot.name}</h2>
			<p class="text-lg opacity-80 mt-2 text-center">
				{data.spot.address}
			</p>

			<div
				class="stats stats-vertical lg:stats-horizontal shadow mt-8 text-neutral bg-base-100"
			>
				<div class="stat place-items-center">
					<div class="stat-title">Price</div>
					<div class="stat-value text-primary">
						{data.spot.pricePerHour}৳
					</div>
					<div class="stat-desc">per hour</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Capacity</div>
					<div class="stat-value">{data.spot.totalSlots}</div>
					<div class="stat-desc">Total Slots</div>
				</div>
			</div>
		</figure>

		<div class="card-body lg:w-1/2">
			<h3 class="text-xl font-bold mb-6 border-b pb-2">
				Reserve Your Spot
			</h3>

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
				<div class="form-control">
					<label class="label"
						><span class="label-text font-medium">Arrival Time</span
						></label
					>
					<input
						type="datetime-local"
						name="startTime"
						bind:value={startTime}
						min={minDate}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label"
						><span class="label-text font-medium"
							>Departure Time</span
						></label
					>
					<input
						type="datetime-local"
						name="endTime"
						bind:value={endTime}
						min={startTime || minDate}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="bg-base-200 rounded-lg p-4 mt-6">
					<div class="flex justify-between items-center text-sm mb-2">
						<span>Rate</span>
						<span>{data.spot.pricePerHour} BDT / hr</span>
					</div>
					<div
						class="flex justify-between items-center text-sm mb-2 border-b border-gray-300 pb-2"
					>
						<span>Duration</span>
						<span>
							{totalCost > 0
								? (
										totalCost /
										(data.spot.pricePerHour || 1)
									).toFixed(1)
								: 0} hrs
						</span>
					</div>
					<div
						class="flex justify-between items-center font-bold text-lg text-primary"
					>
						<span>Estimated Total</span>
						<span>{Math.max(0, totalCost).toFixed(2)} BDT</span>
					</div>
				</div>

				{#if form?.message}
					<div
						role="alert"
						class="alert alert-error text-sm py-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current shrink-0 h-5 w-5"
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

				<div class="card-actions justify-end mt-6">
					<a
						href="/app/parking/available"
						class="btn btn-ghost">Cancel</a
					>
					<button
						class="btn btn-primary w-full md:w-auto"
						disabled={loading || totalCost <= 0}
					>
						{#if loading}
							<span class="loading loading-spinner"></span>
						{/if}
						Confirm Booking
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
