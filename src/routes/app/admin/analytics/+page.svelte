<script lang="ts">
	import { fade } from "svelte/transition";

	let { data } = $props();

	// --- Data Processing for Donut Chart ---
	const totalReports = $derived(
		data.stats.reduce((acc, curr) => acc + curr.count, 0),
	);

	// Calculate SVG circle segments
	let accumulatedPercent = 0;
	const donutData = $derived(
		data.stats.map(s => {
			const percent = (s.count / totalReports) * 100;
			const offset = accumulatedPercent;
			accumulatedPercent += percent;
			return { ...s, percent, offset, color: getColor(s.status) };
		}),
	);

	function getColor(status: string | null) {
		if (status === "Heavy") return "#ef4444"; // error
		if (status === "Moderate") return "#eab308"; // warning
		if (status === "Clear") return "#22c55e"; // success
		return "#cbd5e1";
	}

	// --- Data Processing for Bar Chart ---
	const maxCount = $derived(Math.max(...data.activity.map(a => a.count), 1)); // Avoid div by zero
</script>

<div class="max-w-6xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)] space-y-8">
	<div>
		<h1 class="text-3xl font-bold">📈 Traffic Analytics</h1>
		<p class="text-gray-500">System insights and reporting trends.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div class="card bg-base-100 shadow-xl border border-base-200">
			<div class="card-body items-center">
				<h2 class="card-title self-start mb-4">Report Composition</h2>

				<div class="relative w-64 h-64">
					<svg
						viewBox="0 0 100 100"
						class="w-full h-full transform -rotate-90"
					>
						{#each donutData as slice}
							<circle
								cx="50"
								cy="50"
								r="40"
								fill="transparent"
								stroke={slice.color}
								stroke-width="20"
								stroke-dasharray="{slice.percent * 2.51} 251"
								stroke-dashoffset="-{slice.offset * 2.51}"
								class="transition-all duration-1000 ease-out hover:opacity-80"
							></circle>
						{/each}
						{#if totalReports === 0}
							<circle
								cx="50"
								cy="50"
								r="40"
								fill="transparent"
								stroke="#f3f4f6"
								stroke-width="20"
							></circle>
						{/if}
					</svg>

					<div
						class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
					>
						<span class="text-4xl font-bold">{totalReports}</span>
						<span class="text-xs text-gray-400 uppercase"
							>Total Reports</span
						>
					</div>
				</div>

				<div class="flex gap-4 mt-6 flex-wrap justify-center">
					{#each donutData as slice}
						<div class="flex items-center gap-2 text-sm">
							<span
								class="w-3 h-3 rounded-full"
								style="background-color: {slice.color};"
							></span>
							<span class="font-medium">{slice.status}</span>
							<span class="opacity-50"
								>({Math.round(slice.percent)}%)</span
							>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl border border-base-200">
			<div class="card-body">
				<h2 class="card-title mb-6">Weekly Submission Trend</h2>

				{#if data.activity.length === 0}
					<div
						class="h-64 flex items-center justify-center text-gray-300"
					>
						No data available
					</div>
				{:else}
					<div class="flex items-end justify-between h-64 gap-2 pt-4">
						{#each data.activity as day, i}
							<div
								class="flex flex-col items-center gap-2 w-full group"
								transition:fade={{ delay: i * 50 }}
							>
								<span
									class="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1"
								>
									{day.count}
								</span>

								<div
									class="w-full max-w-10 bg-primary rounded-t-md hover:bg-primary-focus transition-all relative"
									style="height: {(day.count / maxCount) *
										100}%"
								></div>

								<span class="text-xs text-gray-500 font-mono"
									>{day.date}</span
								>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
