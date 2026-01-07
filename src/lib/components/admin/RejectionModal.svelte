<script lang="ts">
	import { enhance } from '$app/forms';
	import { REJECTION_REASON_LABELS } from '$lib/constants/admin';

	interface Props {
		requestId: number;
		isLoading?: boolean;
		onSuccess?: () => void;
		onCancel?: () => void;
	}

	let { requestId, isLoading = false, onSuccess, onCancel }: Props = $props();

	let formElement: HTMLFormElement;
	let rejectionReason = $state('ProviderUnavailable');
	let customReason = $state('');

	const reasons = Object.entries(REJECTION_REASON_LABELS).map(([key, label]) => ({
		key,
		label,
	}));
</script>

<form
	bind:this={formElement}
	method="POST"
	action="/app/admin/requests/{requestId}/reject"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				onSuccess?.();
			}
		};
	}}
>
	<div class="modal-box max-w-md">
		<h3 class="font-bold text-lg mb-4">Reject Service Request</h3>

		<div class="form-control w-full mb-4">
			<label class="label">
				<span class="label-text font-semibold">Rejection Reason</span>
			</label>
			<select
				class="select select-bordered"
				name="rejectionReason"
				bind:value={rejectionReason}
				disabled={isLoading}
			>
				{#each reasons as { key, label }}
					<option value={key}>{label}</option>
				{/each}
			</select>
		</div>

		{#if rejectionReason === 'Other' || customReason}
			<div class="form-control w-full mb-4">
				<label class="label">
					<span class="label-text">Please specify the reason</span>
				</label>
				<textarea
					class="textarea textarea-bordered h-20"
					placeholder="Explain why this request is being rejected..."
					name="customReason"
					bind:value={customReason}
					disabled={isLoading}
				></textarea>
			</div>
		{/if}

		<div class="modal-action">
			<button
				type="button"
				class="btn"
				onclick={onCancel}
				disabled={isLoading}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="btn btn-error"
				disabled={isLoading || (rejectionReason === 'Other' && !customReason.trim())}
			>
				{#if isLoading}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				Reject
			</button>
		</div>
	</div>
</form>
