<!-- svelte-ignore a11y_label_has_associated_control -->
<script lang="ts">
	import { enhance } from "$app/forms";
	import SaveProviderButton from '$lib/components/SaveProviderButton.svelte';

	let { data, form } = $props();
	let loading = $state(false);

	// Helper: Define available services based on provider type
	// This makes the dropdown relevant to the specific business
	const servicesMap: Record<string, string[]> = {
		CarWash: [
			"Full Body Wash",
			"Interior Cleaning",
			"Polish & Wax",
			"Engine Wash",
		],
		Mechanic: [
			"General Checkup",
			"Oil Change",
			"Brake Repair",
			"Engine Diagnostics",
		],
		Towing: ["Scheduled Towing", "Long Distance Haul"],
		Fuel: ["Bulk Fuel Delivery", "LPG Conversion"],
		Emergency: ["General Assistance"],
	};

	// Default to generic if type not found
	let availableServices = $derived(
		servicesMap[data.provider.type] || ["General Consultation"],
	);

	// Prevent booking in the past
	const minDate = new Date().toISOString().slice(0, 16);
</script>

<div
	class="min-h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center p-4"
>
	<div
		class="card md:card-side bg-base-100 shadow-xl max-w-4xl w-full border border-base-300 overflow-hidden"
	>
		<figure
			class="md:w-2/5 bg-neutral text-neutral-content p-8 flex flex-col items-center justify-center text-center relative"
		>
			<div class="avatar placeholder mb-4">
				<div
					class="bg-neutral-focus text-neutral-content rounded-full w-24 border-4 border-primary"
				>
					<span class="text-4xl">🛠️</span>
				</div>
			</div>

			<h2 class="text-2xl font-bold">{data.provider.name}</h2>
			<div class="badge badge-primary badge-outline mt-2">
				{data.provider.type}
			</div>

			<div class="mt-6 text-sm opacity-90 space-y-2">
				<p class="flex items-center gap-2 justify-center">
					<span>📍</span>
					{data.provider.address}
				</p>
				<p class="flex items-center gap-2 justify-center">
					<span>📞</span>
					{data.provider.contactInfo}
				</p>
				<div class="rating rating-sm disabled mt-2">
					{#each Array(5) as _, i}
						<input
							type="radio"
							class="mask mask-star-2 bg-warning"
							checked={i < (data.provider.rating || 0)}
							disabled
						/>
					{/each}
				</div>
			</div>

			<div class="mt-6 w-full px-4">
				<SaveProviderButton providerId={data.provider.id} />
			</div>
		</figure>

		<div class="card-body md:w-3/5">
			<h3 class="card-title text-2xl mb-1">Schedule Appointment</h3>
			<p class="text-xs text-gray-500 mb-6">
				Book a slot for your vehicle maintenance.
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
				<div class="form-control">
					<label class="label"
						><span class="label-text font-semibold"
							>Service Required</span
						></label
					>
					<select
						name="serviceType"
						class="select select-bordered w-full"
						required
					>
						<option
							disabled
							selected
							value="">Choose a service...</option
						>
						{#each availableServices as svc}
							<option value={svc}>{svc}</option>
						{/each}
					</select>
				</div>

				<div class="form-control">
					<label class="label"
						><span class="label-text font-semibold"
							>Preferred Time</span
						></label
					>
					<input
						type="datetime-local"
						name="appointmentTime"
						min={minDate}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label"
						><span class="label-text font-semibold"
							>Vehicle Details / Notes</span
						></label
					>
					<textarea
						name="notes"
						class="textarea textarea-bordered h-20"
						placeholder="e.g. My car is a Toyota Corolla (2018), needs synthetic oil..."
					></textarea>
				</div>

				{#if form?.message}
					<div
						role="alert"
						class="alert alert-error text-sm py-2"
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

				<div class="card-actions justify-end mt-6">
					<a
						href="/services/request"
						class="btn btn-ghost">Cancel</a
					>
					<button
						class="btn btn-primary w-full md:w-auto"
						disabled={loading}
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
