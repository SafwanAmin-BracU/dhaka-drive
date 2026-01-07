<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ProviderSaveStatusResponse } from '$lib/types/saved-provider';

	interface Props {
		providerId: string;
	}

	let { providerId }: Props = $props();

	let isSaved = $state(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let showSuccess = $state(false);

	// Load initial save status
	async function loadSaveStatus() {
		try {
			const response = await fetch(`/app/services/book/${providerId}`, {
				method: 'GET'
			});

			if (!response.ok) {
				throw new Error('Failed to load save status');
			}

			const data: ProviderSaveStatusResponse = await response.json();
			isSaved = data.isSaved;
		} catch (err) {
			console.error('Error loading save status:', err);
			error = 'Failed to load save status';
		}
	}

	// Initialize on mount
	$effect.pre(() => {
		loadSaveStatus();
	});

	// Toggle save status
	async function handleToggle() {
		isLoading = true;
		error = null;
		showSuccess = false;

		try {
			const response = await fetch(`/app/services/book/${providerId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					providerId,
					action: isSaved ? 'unsave' : 'save'
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update save status');
			}

			const data = await response.json();

			// Update local state
			isSaved = !isSaved;
			showSuccess = true;

			// Clear success message after 2 seconds
			setTimeout(() => {
				showSuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Error updating save status:', err);
			error = err instanceof Error ? err.message : 'Failed to update save status';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col gap-2">
	<button
		class="btn btn-sm"
		class:btn-primary={!isSaved}
		class:btn-ghost={isSaved}
		on:click={handleToggle}
		disabled={isLoading}
	>
		{#if isLoading}
			<span class="loading loading-spinner loading-xs"></span>
		{:else}
			<span class="text-lg">{isSaved ? '❤️' : '🤍'}</span>
		{/if}
		<span>{isSaved ? 'Saved' : 'Save Provider'}</span>
	</button>

	{#if error}
		<div class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2m2 2l2 2"
				/>
			</svg>
			<span>{error}</span>
		</div>
	{/if}

	{#if showSuccess}
		<div class="alert alert-success">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{isSaved ? 'Provider saved successfully!' : 'Provider removed from saved list'}</span>
		</div>
	{/if}
</div>
