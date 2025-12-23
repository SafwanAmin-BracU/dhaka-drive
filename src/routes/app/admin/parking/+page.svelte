<script lang="ts">
	import { enhance } from "$app/forms";

	let { data, form } = $props();

	// State for the Edit Modal
	let editingSpot = $state<(typeof data.spots)[0] | null>(null);
	let modal: HTMLDialogElement;

	function openEditModal(spot: (typeof data.spots)[0]) {
		editingSpot = spot;
		modal.showModal();
	}
</script>

<div class="p-6 bg-base-100 min-h-screen">
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold">🅿️ Parking Management</h1>
			<p class="text-gray-500">
				Admin Dashboard • {data.spots.length} Total Listings
			</p>
		</div>
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">Total Capacity</div>
				<div class="stat-value text-primary">
					{data.spots.reduce((acc, s) => acc + s.totalSlots, 0)}
				</div>
				<div class="stat-desc">Slots across city</div>
			</div>
		</div>
	</div>

	{#if form?.message}
		<div
			role="alert"
			class={`alert ${form.success ? "alert-success" : "alert-error"} mb-4`}
		>
			<span>{form.message}</span>
		</div>
	{/if}

	<div
		class="overflow-x-auto shadow-xl rounded-box border border-base-200 bg-white"
	>
		<table class="table table-zebra w-full">
			<thead>
				<tr class="bg-base-200 text-base-content uppercase text-sm">
					<th>ID</th>
					<th>Location Info</th>
					<th>Capacity</th>
					<th>Rate</th>
					<th>Status</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.spots as spot}
					<tr class="hover">
						<th class="opacity-50">#{spot.id}</th>
						<td>
							<div class="font-bold">{spot.name}</div>
							<div class="text-xs opacity-60">{spot.address}</div>
						</td>
						<td>
							<div class="badge badge-ghost gap-2">
								{spot.totalSlots} Slots
							</div>
						</td>
						<td>{spot.pricePerHour} ৳/hr</td>
						<td>
							{#if spot.isAvailable}
								<div class="badge badge-success text-white">
									Active
								</div>
							{:else}
								<div class="badge badge-error text-white">
									Full/Closed
								</div>
							{/if}
						</td>
						<td class="text-right space-x-2">
							<button
								class="btn btn-sm btn-ghost border-base-300"
								onclick={() => openEditModal(spot)}
							>
								✏️ Edit
							</button>

							<form
								method="POST"
								action="?/deleteSpot"
								use:enhance
								class="inline"
							>
								<input
									type="hidden"
									name="id"
									value={spot.id}
								/>
								<button
									class="btn btn-sm btn-ghost text-error hover:bg-error/10"
									onclick={e =>
										!confirm(
											"Are you sure you want to delete this spot?",
										) && e.preventDefault()}
								>
									🗑️
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<dialog
	bind:this={modal}
	class="modal"
>
	<div class="modal-box w-11/12 max-w-2xl">
		<h3 class="font-bold text-lg mb-4">Edit Parking Spot</h3>

		{#if editingSpot}
			<form
				method="POST"
				action="?/updateSpot"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						modal.close(); // Close modal on success
					};
				}}
			>
				<input
					type="hidden"
					name="id"
					value={editingSpot.id}
				/>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label"
							><span class="label-text">Parking Name</span></label
						>
						<input
							type="text"
							name="name"
							value={editingSpot.name}
							class="input input-bordered"
							required
						/>
					</div>

					<div class="form-control">
						<label class="label"
							><span class="label-text">Address</span></label
						>
						<input
							type="text"
							name="address"
							value={editingSpot.address}
							class="input input-bordered"
						/>
					</div>

					<div class="form-control">
						<label class="label"
							><span class="label-text">Total Slots</span></label
						>
						<input
							type="number"
							name="totalSlots"
							value={editingSpot.totalSlots}
							class="input input-bordered"
						/>
					</div>

					<div class="form-control">
						<label class="label"
							><span class="label-text">Price (BDT/hr)</span
							></label
						>
						<input
							type="number"
							name="pricePerHour"
							value={editingSpot.pricePerHour}
							class="input input-bordered"
						/>
					</div>
				</div>

				<div class="form-control mt-4">
					<label class="label cursor-pointer justify-start gap-4">
						<input
							type="checkbox"
							name="isAvailable"
							class="toggle toggle-success"
							checked={editingSpot.isAvailable}
						/>
						<span class="label-text font-bold"
							>Mark as Available / Open</span
						>
					</label>
				</div>

				<div class="modal-action">
					<button
						type="button"
						class="btn"
						onclick={() => modal.close()}>Cancel</button
					>
					<button
						type="submit"
						class="btn btn-primary">Save Changes</button
					>
				</div>
			</form>
		{/if}
	</div>
	<form
		method="dialog"
		class="modal-backdrop"
	>
		<button>close</button>
	</form>
</dialog>
