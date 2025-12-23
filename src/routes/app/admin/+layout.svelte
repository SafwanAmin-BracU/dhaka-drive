<script lang="ts">
	import { page } from "$app/stores";
	let { children } = $props();

	const tabs = [
		{ name: "Dashboard", path: "/app/admin", exact: true },
		{ name: "Parking", path: "/app/admin/parking" },
		{ name: "Traffic", path: "/app/admin/traffic" },
		{ name: "Analytics", path: "/app/admin/analytics" },
		{ name: "Feedback", path: "/app/admin/feedback" },
	];

	const isActive = (t: (typeof tabs)[0]) =>
		t.exact
			? $page.url.pathname === t.path
			: $page.url.pathname.startsWith(t.path);
</script>

<div class="w-full">
	<div
		class="bg-neutral text-neutral-content rounded-xl shadow-lg mb-6 p-2 overflow-x-auto"
	>
		<div
			class="tabs tabs-boxed bg-transparent justify-start md:justify-center w-full min-w-max"
		>
			{#each tabs as tab}
				<a
					href={tab.path}
					class="tab tab-sm md:tab-md transition-all text-neutral-content {isActive(
						tab,
					)
						? 'tab-active bg-white text-neutral shadow-sm'
						: 'hover:bg-neutral-focus'}"
				>
					{tab.name}
				</a>
			{/each}
		</div>
	</div>

	{@render children()}
</div>
