<script lang="ts">
	import { fade } from "svelte/transition";
</script>

<div
	class="max-w-4xl mx-auto p-4 md:p-6"
	in:fade
>
	<div class="text-center mb-10">
		<h1 class="text-4xl font-bold mb-2">🚦 Traffic Central</h1>
		<p class="text-gray-500">Real-time updates, reporting, and news.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<a
			href="/app/traffic/summary"
			class="card bg-base-100 shadow-lg hover:shadow-xl transition-all border-l-8 border-primary group"
		>
			<div class="card-body">
				<div class="flex items-center gap-4">
					<div class="p-3 bg-primary/10 rounded-full text-3xl">
						📊
					</div>
					<div>
						<h2
							class="card-title group-hover:text-primary transition-colors"
						>
							Pulse & Summary
						</h2>
						<p class="text-sm text-gray-500">
							View real-time heavy traffic zones.
						</p>
					</div>
				</div>
			</div>
		</a>

		<a
			href="/app/traffic/report/new"
			class="card bg-base-100 shadow-lg hover:shadow-xl transition-all border-l-8 border-error group"
		>
			<div class="card-body">
				<div class="flex items-center gap-4">
					<div class="p-3 bg-error/10 rounded-full text-3xl">📢</div>
					<div>
						<h2
							class="card-title group-hover:text-error transition-colors"
						>
							Report Incident
						</h2>
						<p class="text-sm text-gray-500">
							Submit accidents or road blocks.
						</p>
					</div>
				</div>
			</div>
		</a>

		<a
			href="/app/traffic/news"
			class="card bg-base-100 shadow-lg hover:shadow-xl transition-all border-l-8 border-info group"
		>
			<div class="card-body">
				<div class="flex items-center gap-4">
					<div class="p-3 bg-info/10 rounded-full text-3xl">📰</div>
					<div>
						<h2
							class="card-title group-hover:text-info transition-colors"
						>
							Traffic News
						</h2>
						<p class="text-sm text-gray-500">
							Official updates and closures.
						</p>
					</div>
				</div>
			</div>
		</a>

		<a
			href="/app/traffic/report"
			class="card bg-base-100 shadow-lg hover:shadow-xl transition-all border-l-8 border-success group"
		>
			<div class="card-body">
				<div class="flex items-center gap-4">
					<div class="p-3 bg-success/10 rounded-full text-3xl">
						📍
					</div>
					<div>
						<h2
							class="card-title group-hover:text-success transition-colors"
						>
							Nearby Feed
						</h2>
						<p class="text-sm text-gray-500">
							See reports around you.
						</p>
					</div>
				</div>
			</div>
		</a>
	</div>
</div>
