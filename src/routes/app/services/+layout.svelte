<script lang="ts">
	import { page } from "$app/stores";
	let { children } = $props();

	const tabs = [
		{ name: "Overview", path: "/app/services", exact: true },
		{ name: "Book", path: "/app/services/request" }, // "Request" is the booking list
		{ name: "History", path: "/app/services/history" },
		{ name: "Requests", path: "/app/services/requests" }, // Immediate help history
		{ name: "Saved", path: "/app/services/saved" },
		{ name: "Emergency", path: "/app/services/emergency", isSpecial: true },
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
						: ''} {tab.isSpecial ? 'text-error font-bold' : ''}"
				>
					{tab.name}
				</a>
			{/each}
		</div>
	</div>

	{@render children()}
</div>
