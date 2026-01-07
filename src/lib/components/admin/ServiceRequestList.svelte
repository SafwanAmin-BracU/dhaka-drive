<script lang="ts">
	import { REQUEST_STATUS_LABELS, REQUEST_STATUSES, SERVICE_TYPE_ICONS } from '$lib/constants/admin';
	import type { ServiceRequestListItem } from '$lib/types/service-request-approval';
	import Badge from '../Badge.svelte';

	interface Props {
		requests: ServiceRequestListItem[];
		isLoading?: boolean;
		onRequestSelect?: (requestId: number) => void;
		sortBy?: 'submittedAt' | 'serviceType' | 'providerName';
		sortOrder?: 'asc' | 'desc';
		onSort?: (sortBy: 'submittedAt' | 'serviceType' | 'providerName', order: 'asc' | 'desc') => void;
	}

	let { 
		requests = [], 
		isLoading = false, 
		onRequestSelect,
		sortBy = 'submittedAt',
		sortOrder = 'desc',
		onSort,
	}: Props = $props();

	function handleSort(column: 'submittedAt' | 'serviceType' | 'providerName') {
		const newOrder = sortBy === column && sortOrder === 'desc' ? 'asc' : 'desc';
		onSort?.(column, newOrder);
	}

	function formatDateTime(date: Date | string) {
		if (!date) return 'N/A';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function getServiceIcon(serviceType?: string) {
		if (!serviceType) return '📋';
		const icon = SERVICE_TYPE_ICONS[serviceType as keyof typeof SERVICE_TYPE_ICONS];
		return icon || '📋';
	}

	function getSortIndicator(column: string): string {
		if (sortBy !== column) return '';
		return sortOrder === 'asc' ? ' ▲' : ' ▼';
	}
</script>

<div class="overflow-x-auto">
	<table class="table table-zebra w-full">
		<thead class="bg-base-300">
			<tr>
				<th class="text-sm font-semibold">
					<button 
						class="btn btn-ghost btn-sm btn-block text-left"
						onclick={() => handleSort('submittedAt')}
					>
						Submitted{getSortIndicator('submittedAt')}
					</button>
				</th>
				<th class="text-sm font-semibold">
					<button 
						class="btn btn-ghost btn-sm btn-block text-left"
						onclick={() => handleSort('serviceType')}
					>
						Service{getSortIndicator('serviceType')}
					</button>
				</th>
				<th class="text-sm font-semibold">User</th>
				<th class="text-sm font-semibold">
					<button 
						class="btn btn-ghost btn-sm btn-block text-left"
						onclick={() => handleSort('providerName')}
					>
						Provider{getSortIndicator('providerName')}
					</button>
				</th>
				<th class="text-sm font-semibold">Status</th>
				<th class="text-sm font-semibold">Action</th>
			</tr>
		</thead>
		<tbody>
			{#if isLoading}
				<tr>
					<td colspan="6" class="text-center py-4">
						<span class="loading loading-spinner loading-md"></span>
					</td>
				</tr>
			{:else if requests.length === 0}
				<tr>
					<td colspan="6" class="text-center py-8 text-base-content/60">
						No pending requests
					</td>
				</tr>
			{:else}
				{#each requests as request (request.id)}
					<tr class="hover:bg-base-200 cursor-pointer" onclick={() => onRequestSelect?.(request.id)}>
						<td class="text-sm">
							{formatDateTime(request.submittedAt)}
						</td>
						<td class="text-sm">
							<div class="flex items-center gap-2">
								<span class="text-lg">{getServiceIcon(request.serviceType)}</span>
								<span class="max-w-[150px] truncate">{request.providerType || 'Unknown'}</span>
							</div>
						</td>
						<td class="text-sm">
							<div>
								<div class="font-semibold">{request.userName}</div>
								<div class="text-xs text-base-content/60 truncate">{request.userEmail}</div>
							</div>
						</td>
						<td class="text-sm">
							<div class="max-w-[150px]">
								<div class="font-semibold truncate">{request.providerName || 'Unassigned'}</div>
								{#if request.providerType}
									<div class="text-xs text-base-content/60">{request.providerType}</div>
								{/if}
							</div>
						</td>
						<td>
							<Badge status={request.status} />
						</td>
						<td class="text-sm">
							<button 
								class="btn btn-sm btn-primary"
								onclick={(e) => {
									e.stopPropagation();
									onRequestSelect?.(request.id);
								}}
							>
								Review
							</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	/* Override button defaults in table header */
	:global(.table thead button) {
		@apply justify-start;
	}
</style>
