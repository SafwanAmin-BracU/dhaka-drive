<div class="space-y-6">
	<!-- Welcome Section -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Welcome to DhakaDrive</h1>
			<p class="text-base-content/70">Your urban mobility companion for Dhaka</p>
		</div>
		{#if !data.isAuthenticated}
			<a href="/auth" class="btn btn-primary">Sign In</a>
		{/if}
	</div>

	<!-- Quick Actions -->
	<section>
		<h2 class="mb-3 text-lg font-semibold">Quick Actions</h2>
		<QuickActions />
	</section>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Traffic Summary -->
		<TrafficSummary incidents={data.incidents} />

		<!-- Recent Activity -->
		<RecentActivity bookings={data.recentBookings} serviceRequests={data.recentServiceRequests} />
	</div>
</div>

<script lang="ts">
import QuickActions from '$lib/components/dashboard/QuickActions.svelte';
import TrafficSummary from '$lib/components/dashboard/TrafficSummary.svelte';
import RecentActivity from '$lib/components/dashboard/RecentActivity.svelte';
import type { PageProps } from './$types';

let { data }: PageProps = $props();
</script>
