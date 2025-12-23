<script lang="ts">
	import { fade } from "svelte/transition";
</script>

<div
	class="max-w-5xl mx-auto p-4 md:p-6"
	in:fade
>
	<div
		class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
	>
		<div>
			<h1 class="text-4xl font-bold">🛠️ Vehicle Services</h1>
			<p class="text-gray-500">
				Maintenance, cleaning, and roadside assistance.
			</p>
		</div>
		<a
			href="/app/services/emergency"
			class="btn btn-error text-white gap-2 shadow-lg animate-pulse"
		>
			<span class="text-xl">🆘</span> Emergency Directory
		</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<a
			href="/app/services/request"
			class="card bg-primary text-primary-content shadow-xl hover:scale-[1.02] transition-transform"
		>
			<div class="card-body items-center text-center">
				<span class="text-5xl mb-2">📅</span>
				<h2 class="card-title">Book Service</h2>
				<p class="text-sm opacity-90">
					Schedule car wash, mechanics, or towing.
				</p>
			</div>
		</a>

		<a
			href="/app/services/requests"
			class="card bg-secondary text-secondary-content shadow-xl hover:scale-[1.02] transition-transform"
		>
			<div class="card-body items-center text-center">
				<span class="text-5xl mb-2">📍</span>
				<h2 class="card-title">Track Help</h2>
				<p class="text-sm opacity-90">
					View status of active roadside requests.
				</p>
			</div>
		</a>

		<a
			href="/app/services/saved"
			class="card bg-accent text-accent-content shadow-xl hover:scale-[1.02] transition-transform"
		>
			<div class="card-body items-center text-center">
				<span class="text-5xl mb-2">⭐</span>
				<h2 class="card-title">Saved Providers</h2>
				<p class="text-sm opacity-90">
					Quick access to your favorites.
				</p>
			</div>
		</a>
	</div>

	<div
		class="bg-base-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4"
	>
		<div class="flex items-center gap-3">
			<div class="p-3 bg-white rounded-full">📂</div>
			<div>
				<h3 class="font-bold text-lg">Appointment History</h3>
				<p class="text-xs text-gray-500">
					View past maintenance records.
				</p>
			</div>
		</div>
		<a
			href="/app/services/history"
			class="btn btn-neutral btn-sm">View History</a
		>
	</div>
</div>
