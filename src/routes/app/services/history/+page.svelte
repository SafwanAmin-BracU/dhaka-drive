<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade } from "svelte/transition";

	let { data } = $props();

	// State for Tabs
	let activeTab = $state<"upcoming" | "past">("upcoming");

	// Helper to format dates nicely
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	};

	// Filter Logic
	let filteredList = $derived(
		activeTab === "upcoming"
			? data.appointments.filter(
					a =>
						new Date(a.appointmentTime) > new Date() &&
						a.status !== "cancelled",
				)
			: data.appointments.filter(
					a =>
						new Date(a.appointmentTime) <= new Date() ||
						a.status === "cancelled",
				),
	);
</script>

<div class="max-w-4xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div
		class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
	>
		<div>
			<h1 class="text-3xl font-bold">🛠️ Service History</h1>
			<p class="text-gray-500">
				Manage your car wash and mechanic appointments.
			</p>
		</div>

		<div class="tabs tabs-boxed bg-base-200">
			<button
				class="tab {activeTab === 'upcoming' ? 'tab-active' : ''}"
				onclick={() => (activeTab = "upcoming")}
			>
				Upcoming
			</button>
			<button
				class="tab {activeTab === 'past' ? 'tab-active' : ''}"
				onclick={() => (activeTab = "past")}
			>
				Past / Cancelled
			</button>
		</div>
	</div>

	<div class="space-y-4">
		{#if filteredList.length === 0}
			<div
				class="text-center py-16 bg-base-100 border border-base-200 rounded-xl shadow-sm"
			>
				<div class="text-5xl mb-4 opacity-20">📅</div>
				<h3 class="text-lg font-bold opacity-60">
					No appointments found
				</h3>
				<p class="text-sm opacity-50">
					You don't have any records in this category.
				</p>
				{#if activeTab === "upcoming"}
					<a
						href="/app/services/request"
						class="btn btn-primary btn-sm mt-4">Book New Service</a
					>
				{/if}
			</div>
		{:else}
			{#each filteredList as apt (apt.id)}
				<div
					class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all"
					transition:fade
				>
					<div
						class="card-body p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
					>
						<div class="flex gap-4 items-start">
							<div class="avatar placeholder">
								<div
									class="bg-neutral-focus text-neutral-content rounded-full w-12 h-12 flex items-center justify-center text-2xl"
								>
									{apt.providerType === "CarWash"
										? "🚿"
										: "🔧"}
								</div>
							</div>

							<div>
								<h3 class="font-bold text-lg">
									{apt.providerName}
								</h3>
								<div
									class="badge badge-sm badge-outline opacity-70 mb-1"
								>
									{apt.serviceType}
								</div>
								<p class="text-xs text-gray-500">
									📍 {apt.providerAddress}
								</p>

								<div
									class="mt-2 flex items-center gap-2 text-sm font-medium text-primary"
								>
									<span
										>⏰ {formatDate(
											apt.appointmentTime,
										)}</span
									>
								</div>
							</div>
						</div>

						<div
							class="flex flex-col items-end gap-3 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0"
						>
							{#if apt.status === "confirmed"}
								<div class="badge badge-success text-white">
									Confirmed
								</div>
							{:else if apt.status === "cancelled"}
								<div class="badge badge-error text-white">
									Cancelled
								</div>
							{:else}
								<div class="badge badge-neutral">Completed</div>
							{/if}

							{#if activeTab === "upcoming"}
								<form
									method="POST"
									action="?/cancel"
									use:enhance
								>
									<input
										type="hidden"
										name="id"
										value={apt.id}
									/>
									<button
										class="btn btn-xs btn-outline btn-error"
										onclick={e =>
											!confirm(
												"Are you sure you want to cancel this appointment?",
											) && e.preventDefault()}
									>
										Cancel Booking
									</button>
								</form>
							{/if}

							<a
								href="tel:{apt.contactInfo}"
								class="btn btn-xs btn-ghost gap-1"
							>
								📞 Call Provider
							</a>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
