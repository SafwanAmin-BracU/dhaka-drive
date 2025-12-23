<script lang="ts">
	import { fade } from "svelte/transition";

	let { data } = $props();
</script>

<div class="max-w-2xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div
		class="text-center mb-8 bg-error/10 p-6 rounded-xl border border-error/20"
	>
		<div class="text-6xl mb-2">🆘</div>
		<h1 class="text-3xl font-bold text-error-content">
			Emergency Assistance
		</h1>
		<p class="text-gray-600 mt-2 font-medium">
			Tap a provider below to call immediately.
		</p>
	</div>

	<div class="space-y-4">
		{#if data.emergencyContacts.length === 0}
			<div class="alert alert-warning">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					></path></svg
				>
				<span
					>No emergency contacts found in the directory. Please dial
					999.</span
				>
			</div>
		{:else}
			{#each data.emergencyContacts as contact (contact.id)}
				<div
					class="card bg-base-100 shadow-lg border-l-8 border-error hover:scale-[1.01] transition-transform"
					transition:fade
				>
					<div
						class="card-body flex flex-row items-center justify-between p-4 sm:p-6"
					>
						<div class="flex-1 min-w-0 mr-4">
							<h2
								class="card-title text-xl text-gray-900 truncate"
							>
								{contact.name}
							</h2>
							<p
								class="text-sm text-gray-500 flex items-center gap-1 mt-1"
							>
								📍 {contact.address || "Location varies"}
							</p>
							{#if contact.rating}
								<div class="badge badge-sm badge-ghost mt-2">
									⭐ {contact.rating} Rating
								</div>
							{/if}
						</div>

						<a
							href="tel:{contact.contactInfo}"
							class="btn btn-error btn-lg shadow-md text-white gap-2 min-w-25"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
								></path>
							</svg>
							Call
						</a>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="divider mt-8 text-gray-400 text-sm">Or</div>

	<div class="text-center">
		<a
			href="tel:999"
			class="btn btn-outline btn-block text-lg h-16"
		>
			Dial National Emergency (999)
		</a>
	</div>
</div>
