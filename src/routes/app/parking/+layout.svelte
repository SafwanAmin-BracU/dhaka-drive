<script lang="ts">
	import { page } from "$app/stores";
	let { children } = $props();

	const tabs = [
		{ name: "Overview", path: "/app/parking", exact: true },
		{ name: "Find Spot", path: "/app/parking/available" },
		{ name: "My History", path: "/app/parking/history" },
		{ name: "Add Spot", path: "/app/parking/add" }, // Assuming users can add spots
	];

	const isActive = (t: (typeof tabs)[0]) =>
		t.exact
			? $page.url.pathname === t.path
			: $page.url.pathname.startsWith(t.path);
</script>

<div class="w-full">
	<div
		class="bg-base-100 rounded-xl shadow-sm mb-6 p-2 border border-base-200 overflow-x-auto"
	>
		<div
			class="tabs tabs-boxed bg-transparent justify-start md:justify-center w-full min-w-max"
		>
			{#each tabs as tab}
				<a
					href={tab.path}
					class="tab tab-sm md:tab-md transition-all {isActive(tab)
						? 'tab-active bg-primary text-primary-content'
						: ''}"
				>
					{tab.name}
				</a>
			{/each}
		</div>
	</div>

	{@render children()}
</div>
