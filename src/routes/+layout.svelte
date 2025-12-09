<script lang="ts">
	import "./layout.css";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	const links = [
		{ href: "/admin/verification", label: "Admin Verification" },
		{ href: "/services/emergency", label: "Emergency Services" },
		{ href: "/parking", label: "Parking Listings" },
		{ href: "/traffic/summary", label: "Traffic Summary" },
	];
</script>

<div class="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
	<nav
		class="bg-white border-b border-slate-200 py-4 px-8 shadow-lg flex justify-between items-center sticky top-0 z-10"
	>
		<div class="flex items-center gap-3">
			<div
				class="w-4 h-4 rounded-full bg-indigo-500 animate-pulse-slow"
			></div>

			<h1 class="text-2xl font-extrabold tracking-tight text-slate-900">
				Dhaka<span class="text-indigo-700">Drive</span>
			</h1>
		</div>

		<ul class="space-x-3 flex">
			{#each links as link}
				<li>
					<a
						href={link.href}
						class="text-slate-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-md hover:bg-slate-50 transition"
						>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<main class="max-w-6xl mx-auto py-8 px-8">
		{@render children()}
	</main>
</div>
