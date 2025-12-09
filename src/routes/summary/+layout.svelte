<script>
	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-50 text-slate-800 font-sans">
	<nav class="bg-white border-b border-slate-200 py-4 px-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
			<h1 class="text-xl font-bold tracking-tight text-slate-900">CityTraffic<span class="text-indigo-600">Now</span></h1>
		</div>
		<span class="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-600">Live Feed</span>
	</nav>
	
	<main class="max-w-5xl mx-auto p-6">
		{@render children()}
	</main>
</div>