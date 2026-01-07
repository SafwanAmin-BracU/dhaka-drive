<script lang="ts">
	import { goto } from '$app/navigation';
	import ServiceRequestDetails from '$lib/components/admin/ServiceRequestDetails.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-base-200 p-4 md:p-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<button
					class="btn btn-sm btn-ghost mb-4"
					onclick={() => goto('/app/admin/requests')}
				>
					← Back to Requests
				</button>
				<h1 class="text-3xl font-bold text-base-content">Request #{data.request.id}</h1>
				<p class="text-base-content/60 mt-2">Review and manage this service request</p>
			</div>
		</div>

		<!-- Details -->
		<ServiceRequestDetails request={data.request} />

		<!-- Action Buttons -->
		<div class="mt-8 flex gap-4 justify-center">
			{#if data.request.status === 'Pending'}
				<button
					class="btn btn-success"
					onclick={() => goto(`/app/admin/requests/${data.request.id}/approve`)}
				>
					✓ Approve Request
				</button>
				<button
					class="btn btn-error"
					onclick={() => goto(`/app/admin/requests/${data.request.id}/reject`)}
				>
					✗ Reject Request
				</button>
			{/if}
		</div>
	</div>
</div>
