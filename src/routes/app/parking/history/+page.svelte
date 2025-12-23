<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade } from "svelte/transition";

	let { data } = $props();

	// Helper to calculate total cost
	function calculateCost(start: Date, end: Date, rate: number | null) {
		const diff = new Date(end).getTime() - new Date(start).getTime();
		const hours = Math.ceil(diff / (1000 * 60 * 60));
		return (hours * (rate || 0)).toFixed(0);
	}

	// Helper to format date
	const fmt = (d: Date) =>
		new Date(d).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});

	// Filter Logic
	let activeTab = $state<"upcoming" | "past">("upcoming");

	let filteredBookings = $derived(
		activeTab === "upcoming"
			? data.history.filter(
					b =>
						new Date(b.endTime) > new Date() &&
						b.status !== "cancelled",
				)
			: data.history.filter(
					b =>
						new Date(b.endTime) <= new Date() ||
						b.status === "cancelled",
				),
	);
</script>

<div class="max-w-4xl mx-auto p-6 min-h-[calc(100vh-64px)]">
	<div class="flex flex-col md:flex-row justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold">📅 My Bookings</h1>
			<p class="text-gray-500">Manage your parking reservations.</p>
		</div>

		<div
			role="tablist"
			class="tabs tabs-boxed mt-4 md:mt-0"
		>
			<button
				role="tab"
				class="tab {activeTab === 'upcoming' ? 'tab-active' : ''}"
				onclick={() => (activeTab = "upcoming")}
			>
				Upcoming
			</button>
			<button
				role="tab"
				class="tab {activeTab === 'past' ? 'tab-active' : ''}"
				onclick={() => (activeTab = "past")}
			>
				History / Cancelled
			</button>
		</div>
	</div>

	<div class="space-y-4">
		{#if filteredBookings.length === 0}
			<div class="text-center py-12 bg-base-200 rounded-lg opacity-60">
				<div class="text-4xl mb-2">📭</div>
				<p>No records found in this category.</p>
			</div>
		{:else}
			{#each filteredBookings as booking (booking.id)}
				<div
					class="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-all"
					transition:fade
				>
					<div
						class="card-body p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
					>
						<div class="flex gap-4 items-center">
							<div
								class="bg-primary/10 p-3 rounded-full text-2xl"
							>
								🅿️
							</div>
							<div>
								<h3 class="font-bold text-lg">
									{booking.spotName}
								</h3>
								<p class="text-xs text-gray-500">
									{booking.address}
								</p>
								<div class="mt-2 text-sm flex gap-4">
									<span class="badge badge-ghost gap-1">
										📅 {fmt(booking.startTime)}
									</span>
									<span class="text-gray-400">➜</span>
									<span class="badge badge-ghost gap-1">
										{fmt(booking.endTime)}
									</span>
								</div>
							</div>
						</div>

						<div
							class="flex flex-col items-end gap-2 w-full md:w-auto text-right"
						>
							<div class="font-bold text-xl text-primary">
								{calculateCost(
									booking.startTime,
									booking.endTime,
									booking.pricePerHour,
								)} ৳
							</div>

							<div class="flex gap-2 items-center">
								{#if booking.status === "confirmed"}
									<div class="badge badge-success text-white">
										Confirmed
									</div>
								{:else if booking.status === "cancelled"}
									<div class="badge badge-error text-white">
										Cancelled
									</div>
								{:else}
									<div class="badge badge-neutral">
										Completed
									</div>
								{/if}
							</div>

							{#if activeTab === "upcoming"}
								<form
									method="POST"
									action="?/cancel"
									use:enhance
									class="mt-2"
								>
									<input
										type="hidden"
										name="id"
										value={booking.id}
									/>
									<button
										class="btn btn-xs btn-outline btn-error"
										onclick={e =>
											!confirm("Cancel this booking?") &&
											e.preventDefault()}
									>
										Cancel Reservation
									</button>
								</form>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
