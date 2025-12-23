<script lang="ts">
	import { fade } from "svelte/transition";
</script>

<div
	class="max-w-6xl mx-auto p-4 md:p-6"
	in:fade
>
	<div class="mb-8">
		<h1 class="text-3xl font-bold">🛡️ Admin Console</h1>
		<p class="text-gray-500">Manage platform resources and user reports.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<a
			href="/app/admin/traffic"
			class="card bg-base-100 shadow hover:shadow-md transition-all border border-base-200"
		>
			<div class="card-body p-6">
				<div class="text-4xl mb-2">🚦</div>
				<h2 class="card-title text-base">Traffic Reports</h2>
				<p class="text-xs text-gray-400">Verify & moderate incidents</p>
			</div>
		</a>

		<a
			href="/app/admin/parking"
			class="card bg-base-100 shadow hover:shadow-md transition-all border border-base-200"
		>
			<div class="card-body p-6">
				<div class="text-4xl mb-2">🅿️</div>
				<h2 class="card-title text-base">Parking</h2>
				<p class="text-xs text-gray-400">Manage spots & availability</p>
			</div>
		</a>

		<a
			href="/app/admin/analytics"
			class="card bg-base-100 shadow hover:shadow-md transition-all border border-base-200"
		>
			<div class="card-body p-6">
				<div class="text-4xl mb-2">📈</div>
				<h2 class="card-title text-base">Analytics</h2>
				<p class="text-xs text-gray-400">System growth & usage stats</p>
			</div>
		</a>

		<a
			href="/app/admin/feedback"
			class="card bg-base-100 shadow hover:shadow-md transition-all border border-base-200"
		>
			<div class="card-body p-6">
				<div class="text-4xl mb-2">📬</div>
				<h2 class="card-title text-base">Inbox</h2>
				<p class="text-xs text-gray-400">User support & feedback</p>
			</div>
		</a>
	</div>
</div>
