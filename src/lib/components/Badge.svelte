<script lang="ts">
	interface Props {
		status: 'Pending' | 'Approved' | 'Rejected';
		size?: 'sm' | 'md' | 'lg';
	}

	let { status, size = 'md' }: Props = $props();

	const statusColors = {
		Pending: 'badge-warning',
		Approved: 'badge-success',
		Rejected: 'badge-error',
	};

	const sizeClasses = {
		sm: 'badge-sm',
		md: 'badge-md',
		lg: 'badge-lg',
	};

	const statusLabels = {
		Pending: 'Pending Review',
		Approved: 'Approved',
		Rejected: 'Rejected',
	};
</script>

<span class="badge {statusColors[status]} {sizeClasses[size]}">
	{statusLabels[status]}
</span>
