<script lang="ts">
	import { goto } from '$app/navigation';
	import { APPROVAL_PAGE_SIZE } from '$lib/constants/admin';
	import ServiceRequestList from '$lib/components/admin/ServiceRequestList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isLoading = $state(false);

	async function handleSort(
		sortBy: 'submittedAt' | 'serviceType' | 'providerName',
		sortOrder: 'asc' | 'desc'
	) {
		isLoading = true;
		await goto(`?sortBy=${sortBy}&order=${sortOrder}&page=1`);
		isLoading = false;
	}

	async function handlePageChange(newPage: number) {
		isLoading = true;
		const params = new URLSearchParams({
			page: newPage.toString(),
			sortBy: data.sortBy,
			order: data.sortOrder,
		});
		await goto(`?${params.toString()}`);
		isLoading = false;
	}

	function handleRequestSelect(requestId: number) {
		goto(`/app/admin/requests/${requestId}`);
	}
</script>

<div class="min-h-screen bg-base-200 p-4 md:p-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-base-content mb-2">Service Request Approvals</h1>
			<p class="text-base-content/60">
				{data.total} pending request{data.total !== 1 ? 's' : ''} awaiting review
			</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<div class="stat bg-base-100 rounded-lg shadow">
				<div class="stat-title">Total Pending</div>
				<div class="stat-value text-warning">{data.total}</div>
			</div>
			<div class="stat bg-base-100 rounded-lg shadow">
				<div class="stat-title">Current Page</div>
				<div class="stat-value text-info">{data.page}/{data.totalPages || 1}</div>
			</div>
			<div class="stat bg-base-100 rounded-lg shadow">
				<div class="stat-title">Per Page</div>
				<div class="stat-value text-primary">{APPROVAL_PAGE_SIZE}</div>
			</div>
		</div>

		<!-- Table Card -->
		<div class="card bg-base-100 shadow-lg">
			<div class="card-body p-4">
				<ServiceRequestList
					requests={data.requests}
					{isLoading}
					onRequestSelect={handleRequestSelect}
					sortBy={data.sortBy}
					sortOrder={data.sortOrder}
					onSort={handleSort}
				/>
			</div>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="flex justify-center gap-2 mt-6">
				<button
					class="btn btn-sm"
					disabled={data.page <= 1}
					onclick={() => handlePageChange(data.page - 1)}
				>
					← Previous
				</button>

				{#each Array.from({ length: data.totalPages }, (_, i) => i + 1) as pageNum}
					<button
						class="btn btn-sm {pageNum === data.page ? 'btn-active' : ''}"
						onclick={() => handlePageChange(pageNum)}
					>
						{pageNum}
					</button>
				{/each}

				<button
					class="btn btn-sm"
					disabled={data.page >= data.totalPages}
					onclick={() => handlePageChange(data.page + 1)}
				>
					Next →
				</button>
			</div>
		{/if}
	</div>
</div>
