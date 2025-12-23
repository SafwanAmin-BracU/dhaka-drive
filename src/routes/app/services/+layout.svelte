<script lang="ts">
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<nav>
	<ul class="menu menu-horizontal">
		<li><a href="/app/services/request/">Request</a></li>
	</ul>
</nav>
{@render children()}
