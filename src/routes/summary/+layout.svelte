<script>
	let { children } = $props();
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

		<!-- <span
			class="text-xs font-bold uppercase bg-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 flex items-center gap-1"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
					clip-rule="evenodd"
				></path>
			</svg>
			Live Feed
		</span> -->
		<ul class="space-x-3 flex">
			<!-- HOME AND CONTACT PAGE LINK -->
			<li>
				<a
					href="/"
					class="text-slate-700 hover:text-slate-900 font-medium px-4 py-2 rounded-lg transition"
					>Home</a
				>
			</li>
			<li>
				<a
					href="/contact"
					class="text-slate-700 hover:text-slate-900 font-medium px-4 py-2 rounded-lg transition"
					>Contact</a
				>
			</li>
		</ul>
	</nav>

	<main class="max-w-6xl mx-auto py-8 px-8">
		{@render children()}
	</main>
</div>
