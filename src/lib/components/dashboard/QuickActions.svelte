<div class="grid grid-cols-1 gap-4 md:grid-cols-3 {className}">
	{#each actions as action}
		<a href={action.href} class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg">
			<div class="card-body">
				<div class="flex items-center gap-3">
					<div class="rounded-lg p-2 text-3xl {action.color}">
						{action.icon}
					</div>
					<div>
						<h3 class="card-title text-lg">{action.title}</h3>
						<p class="text-sm text-base-content/70">{action.description}</p>
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>

<script lang="ts">
interface Props {
	class?: string;
}

let { class: className = '' }: Props = $props();

const actions = [
	{
		title: 'Traffic',
		description: 'View live traffic conditions and reports',
		href: '/app/traffic',
		icon: '🚦',
		color: 'bg-error/10 text-error'
	},
	{
		title: 'Parking',
		description: 'Find and book parking spots nearby',
		href: '/app/parking',
		icon: '🅿️',
		color: 'bg-primary/10 text-primary'
	},
	{
		title: 'Services',
		description: 'Request roadside assistance and repairs',
		href: '/app/services',
		icon: '🔧',
		color: 'bg-success/10 text-success'
	}
];
</script>
