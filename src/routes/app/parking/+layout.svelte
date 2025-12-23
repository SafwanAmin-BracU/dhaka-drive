<script lang="ts">
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<nav>
	<ul class="menu menu-horizontal">
		<li><a href="/app/parking/available">Live Status</a></li>
	</ul>
</nav>
{@render children()}
