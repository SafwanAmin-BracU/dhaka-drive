<script lang="ts">
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<nav class="navbar navbar-center">
	<ul class="menu menu-horizontal">
		<li>
			<a href="/app/traffic/">Overview</a>
		</li>
		<li>
			<a href="/app/traffic/report">Incidents</a>
		</li>
	</ul>
	<div class="flex flex-1"></div>
	<a
		href="/app/traffic/report/new"
		class="btn btn-error btn-outline btn-wide btn-sm">Report</a
	>
</nav>
{@render children()}
