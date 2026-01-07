<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		requestId: number;
		isLoading?: boolean;
		onSuccess?: () => void;
		onCancel?: () => void;
	}

	let { requestId, isLoading = false, onSuccess, onCancel }: Props = $props();

	let formElement: HTMLFormElement;
	let notes = $state('');
</script>

<form
	bind:this={formElement}
	method="POST"
	action="/app/admin/requests/{requestId}/approve"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				onSuccess?.();
			}
		};
	}}
>
	<div class="modal-box max-w-md">
		<h3 class="font-bold text-lg mb-4">Approve Service Request</h3>

		<div class="form-control w-full mb-4">
			<label class="label">
				<span class="label-text">Admin Notes (Optional)</span>
			</label>
			<textarea
				class="textarea textarea-bordered h-24"
				placeholder="Add any notes about this approval..."
				name="notes"
				bind:value={notes}
				disabled={isLoading}
			></textarea>
		</div>

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
				class="btn btn-success"
				disabled={isLoading}
			>
				{#if isLoading}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				Approve
			</button>
		</div>
	</div>
</form>
