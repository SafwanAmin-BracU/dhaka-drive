<script lang="ts">
	import { fade } from "svelte/transition";

	let { data } = $props();

	// Helper to format time (e.g., "2 hours ago")
	const timeAgo = (date: Date | null) => {
		if (!date) return "Unknown time";
		const seconds = Math.floor(
			(new Date().getTime() - new Date(date).getTime()) / 1000,
		);
		let interval = seconds / 3600;
		if (interval > 1) return Math.floor(interval) + " hours ago";
		interval = seconds / 60;
		if (interval > 1) return Math.floor(interval) + " minutes ago";
		return "Just now";
	};
</script>

<div class="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
	<div class="text-center md:text-left">
		<h1 class="text-3xl font-bold">📊 Traffic Pulse</h1>
		<p class="text-gray-500">
			Real-time overview of road conditions reported by users.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div
			class="stat bg-error/10 border border-error/20 rounded-xl shadow-sm text-error"
		>
			<div class="stat-figure text-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block w-8 h-8 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					></path></svg
				>
			</div>
			<div class="stat-title text-error opacity-80">Heavy Traffic</div>
			<div class="stat-value">{data.summary.Heavy}</div>
			<div class="stat-desc text-error/60">Active Reports</div>
		</div>

		<div
			class="stat bg-warning/10 border border-warning/20 rounded-xl shadow-sm text-warning-content"
		>
			<div class="stat-figure text-warning">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block w-8 h-8 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					></path></svg
				>
			</div>
			<div class="stat-title text-warning-content opacity-80">
				Moderate
			</div>
			<div class="stat-value">{data.summary.Moderate}</div>
			<div class="stat-desc text-warning-content/60">Flowing slowly</div>
		</div>

		<div
			class="stat bg-success/10 border border-success/20 rounded-xl shadow-sm text-success"
		>
			<div class="stat-figure text-success">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block w-8 h-8 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					></path></svg
				>
			</div>
			<div class="stat-title text-success opacity-80">Clear Roads</div>
			<div class="stat-value">{data.summary.Clear}</div>
			<div class="stat-desc text-success/60">Good to go</div>
		</div>
	</div>

	<div class="space-y-4">
		<h2 class="text-xl font-bold flex items-center gap-2">
			🚨 Recent High-Impact Alerts
		</h2>

		{#if data.recentAlerts.length === 0}
			<div class="alert bg-base-100 border-base-200">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-info shrink-0 w-6 h-6"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path></svg
				>
				<span>No heavy traffic reported recently. Drive safe!</span>
			</div>
		{:else}
			<div class="grid gap-3">
				{#each data.recentAlerts as alert, i}
					<div
						class="card bg-base-100 border-l-4 border-error shadow-sm hover:bg-base-50 transition-colors"
						in:fade={{ delay: i * 50 }}
					>
						<div
							class="card-body p-4 flex flex-row items-center justify-between"
						>
							<div>
								<h3 class="font-bold text-gray-800">
									{alert.description ||
										"Heavy Traffic Reported"}
								</h3>
								<p class="text-xs text-gray-500 mt-1">
									Reported {timeAgo(alert.createdAt)}
								</p>
							</div>
							<div class="badge badge-error text-white font-mono">
								HEAVY
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="text-center pt-4">
			<a
				href="/app/traffic/report/new"
				class="btn btn-outline btn-sm">Report New Incident</a
			>
		</div>
	</div>
</div>
