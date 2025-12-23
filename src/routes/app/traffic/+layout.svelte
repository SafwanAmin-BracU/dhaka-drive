<script lang="ts">
	import { page } from "$app/stores";
	let { children } = $props();

	// Define tabs
	const tabs = [
		{ name: "Overview", path: "/app/traffic", exact: true },
		{ name: "Summary", path: "/app/traffic/summary" },
		{ name: "Feed", path: "/app/traffic/report", exact: true }, // The generic "report" list
		{ name: "Report New", path: "/app/traffic/report/new" },
		{ name: "News", path: "/app/traffic/news" },
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
					class="tab tab-sm md:tab-md transition-all duration-200 {isActive(
						tab,
					)
						? 'tab-active bg-primary text-primary-content shadow-sm'
						: ''}"
				>
					{tab.name}
				</a>
			{/each}
		</div>
	</div>

	{@render children()}
</div>
