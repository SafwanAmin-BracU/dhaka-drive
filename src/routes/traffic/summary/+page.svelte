<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	// Helper for condition styling
	const getConditionStyle = (condition: string) => {
		const c = condition.toLowerCase();
		if (c.includes("heavy") || c.includes("blocked"))
			return "bg-red-50 text-red-800 border-red-300";
		if (c.includes("moderate"))
			return "bg-amber-50 text-amber-800 border-amber-300";
		return "bg-teal-50 text-teal-800 border-teal-300";
	};
</script>

<header class="mb-10 flex justify-between items-end">
	<div>
		<h2 class="text-4xl font-black text-slate-900">Traffic Status</h2>
		<p class="text-slate-600 mt-2">Real-time summaries for major routes.</p>
	</div>
</header>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each data.summaries as item (item.id)}
		<div
			class="group bg-white rounded-xl border border-slate-300 p-6 hover:shadow-xl transition-all duration-300 hover:bg-slate-50 relative overflow-hidden"
		>
			<div class="flex justify-between items-start mb-4">
				<span
					class="text-xs font-bold uppercase tracking-widest text-slate-500"
					>{item.areaName}</span
				>
				<span
					class={`px-3 py-1 rounded-lg text-xs font-extrabold border ${getConditionStyle(item.condition)}`}
				>
					{item.condition}
				</span>
			</div>

			<h3 class="text-2xl font-extrabold text-slate-900 mb-2">
				{item.routeName}
			</h3>
			<p class="text-base text-slate-700 line-clamp-2 h-12 mb-5">
				{item.description || "No recent details reported."}
			</p>

			<div
				class="flex items-center justify-between text-sm text-slate-500 pt-5 border-t border-slate-200"
			>
				<span
					>Reports: <span class="font-semibold text-slate-700"
						>{item.reportCount}</span
					></span
				>
				<span class="text-slate-300">|</span>
				<span
					>Severity: <span class="font-semibold text-slate-700"
						>{item.severity}</span
					>/5</span
				>
			</div>
		</div>
	{/each}
</div>
