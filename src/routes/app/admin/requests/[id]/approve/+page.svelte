<script lang="ts">
	import { goto } from '$app/navigation';
	import ApprovalModal from '$lib/components/admin/ApprovalModal.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let isLoading = $state(false);

	function handleCancel() {
		goto(`/app/admin/requests/${data.request.id}`);
	}

	function handleSuccess() {
		goto(`/app/admin/requests/${data.request.id}`);
	}
</script>

<div class="modal modal-open">
	<ApprovalModal
		requestId={data.request.id}
		{isLoading}
		onSuccess={handleSuccess}
		onCancel={handleCancel}
	/>
</div>
