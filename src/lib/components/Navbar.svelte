<nav class="navbar bg-base-100 shadow-sm" aria-label="Main navigation">
	<div class="navbar-start">
		{#if isAuthenticated}
			<a href="/app" class="btn btn-ghost" aria-label="Go to profile">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					></path>
				</svg>
				<span class="hidden sm:inline">Profile</span>
			</a>
		{:else}
			<a href="/auth" class="btn btn-primary" aria-label="Log in to your account">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
					></path>
				</svg>
				<span class="hidden sm:inline">Login</span>
			</a>
		{/if}
	</div>

	<div class="navbar-end">
		<a href="/" class="flex items-center gap-2" aria-label="DhakaDrive home">
			<div class="h-4 w-4 animate-pulse rounded-full bg-indigo-500" aria-hidden="true"></div>
			<span class="text-xl font-extrabold tracking-tight">
				Dhaka<span class="text-indigo-700">Drive</span>
			</span>
		</a>
	</div>
</nav>

<script lang="ts">
interface Props {
	isAuthenticated?: boolean;
}

let { isAuthenticated = false }: Props = $props();
</script>
