<script lang="ts">
	import { REQUEST_STATUS_LABELS, SERVICE_TYPE_ICONS } from '$lib/constants/admin';
	import type { ServiceRequestDetail } from '$lib/types/service-request-approval';
	import Badge from '../Badge.svelte';

	interface Props {
		request: ServiceRequestDetail;
	}

	let { request }: Props = $props();

	function formatDateTime(date: Date | string | null) {
		if (!date) return 'N/A';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function getServiceIcon(serviceType?: string) {
		if (!serviceType) return '📋';
		const icon = SERVICE_TYPE_ICONS[serviceType as keyof typeof SERVICE_TYPE_ICONS];
		return icon || '📋';
	}
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Left Column: User & Request Info -->
	<div class="lg:col-span-2 space-y-6">
		<!-- Request Status -->
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title text-lg mb-4">Request Status</h2>
				<div class="flex items-center justify-between">
					<span class="text-base-content/60">Current Status:</span>
					<Badge status={request.status} size="lg" />
				</div>
				{#if request.status === 'Approved'}
					<div class="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
						<p class="text-sm text-success font-semibold">✓ Approved</p>
						<p class="text-xs text-base-content/60 mt-1">
							{formatDateTime(request.approvedAt)}
						</p>
					</div>
				{:else if request.status === 'Rejected'}
					<div class="mt-4 p-3 bg-error/10 rounded-lg border border-error/20">
						<p class="text-sm text-error font-semibold">✗ Rejected</p>
						<p class="text-sm text-base-content mt-1">{request.rejectionReason}</p>
						<p class="text-xs text-base-content/60 mt-1">
							{formatDateTime(request.rejectedAt)}
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Requester Info -->
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title text-lg mb-4">Requester Information</h2>
				<div class="space-y-4">
					<div>
						<label class="label">
							<span class="label-text text-base-content/60">Name</span>
						</label>
						<p class="font-semibold text-base">{request.userName}</p>
					</div>
					<div>
						<label class="label">
							<span class="label-text text-base-content/60">Email</span>
						</label>
						<p class="font-mono text-sm">{request.userEmail}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Request Details -->
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title text-lg mb-4">Request Details</h2>
				<div class="space-y-4">
					<div>
						<label class="label">
							<span class="label-text text-base-content/60">Service Type</span>
						</label>
						<div class="flex items-center gap-2">
							<span class="text-2xl">{getServiceIcon(request.providerType)}</span>
							<p class="font-semibold">{request.providerType || 'Unknown'}</p>
						</div>
					</div>
					<div>
						<label class="label">
							<span class="label-text text-base-content/60">Issue Description</span>
						</label>
						<p class="text-sm text-base-content/80 p-2 bg-base-200/50 rounded">
							{request.issueDescription}
						</p>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Requested Date/Time</span>
							</label>
							<p class="text-sm font-semibold">{formatDateTime(request.requestedDateTime)}</p>
						</div>
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Submitted</span>
							</label>
							<p class="text-sm font-semibold">{formatDateTime(request.submittedAt)}</p>
						</div>
					</div>
					{#if request.notes}
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Admin Notes</span>
							</label>
							<p class="text-sm text-base-content/80 p-2 bg-info/10 rounded">
								{request.notes}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Right Column: Provider Info -->
	<div class="lg:col-span-1">
		<div class="card bg-base-100 shadow-md sticky top-24">
			<div class="card-body">
				<h2 class="card-title text-lg mb-4">Provider Information</h2>
				<div class="space-y-4">
					{#if request.providerId}
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Provider Name</span>
							</label>
							<p class="font-semibold">{request.providerName || 'Unassigned'}</p>
						</div>
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Type</span>
							</label>
							<p class="text-sm">{request.providerType || 'N/A'}</p>
						</div>
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Contact</span>
							</label>
							<p class="text-sm font-mono">{request.providerContact || 'N/A'}</p>
						</div>
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Address</span>
							</label>
							<p class="text-sm">{request.providerAddress || 'N/A'}</p>
						</div>
						<div>
							<label class="label">
								<span class="label-text text-base-content/60">Rating</span>
							</label>
							<div class="flex items-center gap-1">
								<span class="text-lg">⭐</span>
								<span class="font-semibold">{request.providerRating?.toFixed(1) || 'N/A'}</span>
							</div>
						</div>

						{#if request.providerAvailabilityConflict}
							<div class="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
								<p class="text-sm text-warning font-semibold">⚠ Availability Conflict</p>
								<p class="text-xs text-base-content/60 mt-1">
									Provider may have conflicting appointments at requested time
								</p>
							</div>
						{/if}
					{:else}
						<div class="alert alert-info">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="stroke-current shrink-0 w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span>No provider assigned to this request</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
