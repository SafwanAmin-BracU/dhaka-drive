<div class="card bg-base-100 shadow-md {className}">
	<div class="card-body">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="card-title text-lg">
				<span class="text-xl">🚦</span>
				Traffic Updates
			</h2>
			<a href="/app/traffic/news" class="btn btn-ghost btn-sm">View All</a>
		</div>

		{#if incidents.length === 0}
			<div class="py-4 text-center text-base-content/60">
				<p>No traffic updates at the moment</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each incidents.slice(0, 5) as incident}
					<div class="flex gap-3 rounded-lg p-2 transition-colors hover:bg-base-200">
						<div class="mt-1 badge badge-sm badge-warning">!</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">{incident.title}</p>
							<p class="text-xs text-base-content/60">
								{incident.source ?? 'Local Report'} • {formatTimeAgo(incident.publishedAt)}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
interface TrafficIncident {
	id: number;
	title: string;
	content: string;
	source: string | null;
	publishedAt: Date | null;
}

interface Props {
	incidents: TrafficIncident[];
	class?: string;
}

let { incidents, class: className = '' }: Props = $props();

function formatTimeAgo(date: Date | null): string {
	if (!date) return 'Unknown';
	const now = new Date();
	const diffMs = now.getTime() - new Date(date).getTime();
	const diffMins = Math.floor(diffMs / 60000);

	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}
</script>
