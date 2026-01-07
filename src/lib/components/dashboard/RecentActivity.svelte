<div class="card bg-base-100 shadow-md {className}">
	<div class="card-body">
		<h2 class="mb-4 card-title text-lg">
			<span class="text-xl">📋</span>
			Recent Activity
		</h2>

		{#if bookings.length === 0 && serviceRequests.length === 0}
			<div class="py-6 text-center text-base-content/60">
				<p class="mb-2 text-4xl">🎉</p>
				<p>No recent activity</p>
				<p class="text-sm">Book a parking spot or request a service to get started!</p>
			</div>
		{:else}
			<div class="space-y-4">
				<!-- Recent Bookings -->
				{#if bookings.length > 0}
					<div>
						<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
							<span>🅿️</span> Parking Bookings
						</h3>
						<div class="space-y-2">
							{#each bookings.slice(0, 3) as booking}
								<a
									href="/app/parking/history"
									class="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-base-200"
								>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium">
											{booking.spotName ?? 'Parking Spot'}
										</p>
										<p class="text-xs text-base-content/60">
											{formatDate(booking.startTime)}
										</p>
									</div>
									<span class="badge badge-sm {getStatusBadgeClass(booking.status)}">
										{booking.status ?? 'Unknown'}
									</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Recent Service Requests -->
				{#if serviceRequests.length > 0}
					<div>
						<h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
							<span>🔧</span> Service Requests
						</h3>
						<div class="space-y-2">
							{#each serviceRequests.slice(0, 3) as request}
								<a
									href="/app/services/requests"
									class="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-base-200"
								>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium">
											{request.providerName ?? 'Service Request'}
										</p>
										<p class="text-xs text-base-content/60">
											{formatDate(request.createdAt)}
										</p>
									</div>
									<span class="badge badge-sm {getStatusBadgeClass(request.status)}">
										{request.status ?? 'Unknown'}
									</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="mt-4 card-actions justify-end border-t border-base-200 pt-2">
				<a href="/app/parking/history" class="btn btn-ghost btn-sm">View Bookings</a>
				<a href="/app/services/requests" class="btn btn-ghost btn-sm">View Requests</a>
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
interface Booking {
	id: number;
	spotName: string | null;
	startTime: Date;
	status: string | null;
}

interface ServiceRequest {
	id: number;
	providerName: string | null;
	status: string | null;
	createdAt: Date | null;
}

interface Props {
	bookings: Booking[];
	serviceRequests: ServiceRequest[];
	class?: string;
}

let { bookings, serviceRequests, class: className = '' }: Props = $props();

function formatDate(date: Date | null): string {
	if (!date) return 'Unknown';
	return new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

function getStatusBadgeClass(status: string | null): string {
	switch (status?.toLowerCase()) {
		case 'confirmed':
			return 'badge-success';
		case 'pending':
			return 'badge-warning';
		case 'cancelled':
			return 'badge-error';
		case 'completed':
			return 'badge-info';
		default:
			return 'badge-ghost';
	}
}
</script>
