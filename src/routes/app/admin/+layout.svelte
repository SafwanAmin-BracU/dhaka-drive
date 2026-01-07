<div class="w-full">
	<div class="mb-6 overflow-x-auto rounded-xl bg-base-200 p-2 text-base-content shadow-lg">
		<div class="tabs-boxed tabs w-full min-w-max justify-start bg-transparent md:justify-center">
			{#each tabs as tab}
				<a
					href={tab.path}
					class="tab-sm md:tab-md tab transition-all {isActive(tab)
						? 'tab-active bg-base-100 text-base-content shadow-sm'
						: 'hover:bg-base-300'}"
				>
					{tab.name}
				</a>
			{/each}
		</div>
	</div>

	{@render children()}
</div>

<script lang="ts">
import { page } from '$app/stores';
let { children } = $props();

const tabs = [
	{ name: 'Dashboard', path: '/app/admin', exact: true },
	{ name: 'Parking', path: '/app/admin/parking' },
	{ name: 'Traffic', path: '/app/admin/traffic' },
	{ name: 'Analytics', path: '/app/admin/analytics' },
	{ name: 'Feedback', path: '/app/admin/feedback' }
];

const isActive = (t: (typeof tabs)[0]) =>
	t.exact ? $page.url.pathname === t.path : $page.url.pathname.startsWith(t.path);
</script>
