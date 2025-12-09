<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	// Svelte 5 Props
	let { data, form } = $props<{ data: PageData, form: ActionData }>();

	// Local state for modal
	let selectedSummaryId = $state<string | null>(null);
	let selectedSummaryName = $state<string>('');

	// Helper for condition styling
	const getConditionStyle = (condition: string) => {
		const c = condition.toLowerCase();
		if (c.includes('heavy') || c.includes('blocked')) return 'bg-red-50 text-red-700 border-red-200';
		if (c.includes('moderate')) return 'bg-orange-50 text-orange-700 border-orange-200';
		return 'bg-emerald-50 text-emerald-700 border-emerald-200';
	};

	function openUpdateModal(id: string, route: string) {
		selectedSummaryId = id;
		selectedSummaryName = route;
	}
</script>

<header class="mb-8 flex justify-between items-end">
	<div>
		<h2 class="text-3xl font-light text-slate-800">Traffic Status</h2>
		<p class="text-slate-500 mt-1">Real-time summaries for major routes.</p>
	</div>
</header>

{#if form?.success}
	<div class="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 flex items-center shadow-sm">
		<span class="mr-2">✓</span> Traffic report updated successfully.
	</div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
	{#each data.summaries as item (item.id)}
		<div class="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
			
			<div class="flex justify-between items-start mb-4">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400">{item.areaName}</span>
				<span class={`px-2 py-1 rounded text-xs font-bold border ${getConditionStyle(item.condition)}`}>
					{item.condition}
				</span>
			</div>

			<h3 class="text-xl font-semibold text-slate-900 mb-2">{item.routeName}</h3>
			<p class="text-sm text-slate-600 line-clamp-2 h-10 mb-4">
				{item.description || "No recent details reported."}
			</p>

			<div class="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
				<span>Reports: {item.reportCount}</span>
				<span>Severity: {item.severity}/5</span>
			</div>

			<button 
				onclick={() => openUpdateModal(item.id, item.routeName)}
				class="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded transition-colors border border-slate-200"
			>
				Report Update
			</button>
		</div>
	{/each}
</div>

{#if selectedSummaryId}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
			
			<div class="mb-5">
				<h3 class="text-lg font-bold text-slate-800">Update Condition</h3>
				<p class="text-sm text-slate-500">Route: {selectedSummaryName}</p>
			</div>

			<form method="POST" action="?/updateCondition" use:enhance={() => {
				return async ({ update }) => {
					await update();
					selectedSummaryId = null;
				};
			}}>
				<input type="hidden" name="id" value={selectedSummaryId} />

				<div class="space-y-4">
					<div>
						<label class="block text-xs font-bold uppercase text-slate-500 mb-1">Current Status</label>
						<select name="condition" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
							<option value="Clear">Clear</option>
							<option value="Moderate">Moderate</option>
							<option value="Heavy">Heavy</option>
							<option value="Blocked">Blocked</option>
						</select>
					</div>

					<div>
						<label class="block text-xs font-bold uppercase text-slate-500 mb-1">Severity (1-5)</label>
						<input type="range" name="severity" min="1" max="5" step="1" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
						<div class="flex justify-between text-xs text-slate-400 px-1 mt-1">
							<span>Low</span><span>Critical</span>
						</div>
					</div>

					<div>
						<label class="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
						<textarea name="description" rows="3" class="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Broken down truck in left lane..."></textarea>
					</div>
				</div>

				<div class="flex gap-3 mt-6">
					<button type="button" class="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors" onclick={() => selectedSummaryId = null}>Cancel</button>
					<button type="submit" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition-all">Submit Update</button>
				</div>
			</form>
		</div>
	</div>
{/if}