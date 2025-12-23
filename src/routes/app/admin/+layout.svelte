<script lang="ts">
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<ul class="menu menu-horizontal">
	<li>
		<a href="/app/admin/parking">Parking Admin</a>
	</li>
</ul>
{@render children()}
