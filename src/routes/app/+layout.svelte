<script lang="ts">
	import { page } from "$app/state";
	import "$lib/app.css";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
	const navLinks: NavLink[] = [
		{ href: "/app", label: "Dashboard" },
		{ href: "/app/admin", label: "Admin" },
		{ href: "/app/services", label: "Services" },
		{ href: "/app/parking", label: "Parking" },
		{ href: "/app/traffic", label: "Traffic" },
	];
</script>

<div class="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
	<nav class="navbar">
		<div class="flex flex-1 items-center gap-3">
			<div
				class="w-4 h-4 rounded-full bg-indigo-500 animate-pulse-slow"
			></div>
			<h1 class="text-2xl font-extrabold tracking-tight text-slate-900">
				Dhaka<span class="text-indigo-700">Drive</span>
			</h1>
		</div>
		<div>
			<ul class="menu menu-horizontal">
				<li><a href="/app/">Dashboard</a></li>
				<li><a href="/app/admin">Admin</a></li>
				<li><a href="/app/services">Services</a></li>
				<li>
					<a href="/app/traffic">Traffic</a>
				</li>
				<li><a href="/app/parking">Parking</a></li>
			</ul>
		</div>
	</nav>

	<main class="max-w-6xl mx-auto py-8 px-8">
		{@render children()}
	</main>
</div>
