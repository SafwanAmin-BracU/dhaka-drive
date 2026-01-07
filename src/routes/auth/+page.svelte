<svelte:head>
	<title>Sign In - DhakaDrive</title>
	<meta
		name="description"
		content="Sign in to your DhakaDrive account to access traffic updates, parking, and vehicle services."
	/>
</svelte:head>

<div class="min-h-screen bg-base-200">
	<Navbar isAuthenticated={data.isAuthenticated} />

	<main class="container mx-auto px-4 py-12">
		<div class="flex justify-center">
			<div class="card w-full max-w-md bg-base-100 shadow-xl">
				<div class="card-body">
					<h1 class="mb-6 card-title justify-center text-2xl font-bold">Welcome to DhakaDrive</h1>

					{#if errorMessage}
						<div class="mb-4 alert alert-error" role="alert">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span>{errorMessage}</span>
						</div>
					{/if}

					<form class="space-y-4" aria-label="Sign in form">
						<div class="form-control">
							<label class="label" for="email">
								<span class="label-text">Email</span>
							</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="you@example.com"
								class="input-bordered input w-full"
								required
								autocomplete="email"
								aria-required="true"
							/>
						</div>

						<div class="form-control">
							<label class="label" for="password">
								<span class="label-text">Password</span>
							</label>
							<input
								type="password"
								id="password"
								name="password"
								placeholder="••••••••"
								class="input-bordered input w-full"
								required
								autocomplete="current-password"
								aria-required="true"
							/>
						</div>

						<div class="form-control mt-6">
							<button
								type="submit"
								class="btn w-full btn-primary"
								disabled={isLoading}
								aria-busy={isLoading}
							>
								{#if isLoading}
									<span class="loading loading-sm loading-spinner" aria-hidden="true"></span>
									Signing in...
								{:else}
									Sign In
								{/if}
							</button>
						</div>
					</form>

					<div class="divider">OR</div>

					<p class="text-center text-sm text-base-content/70">
						Don't have an account?
						<a href="/auth" class="link link-primary">Sign up</a>
					</p>

					<p class="mt-4 text-center text-xs text-base-content/50">
						<!-- TODO: Implement actual auth with Better Auth -->
						Authentication coming soon. This is a placeholder form.
					</p>
				</div>
			</div>
		</div>
	</main>
</div>

<script lang="ts">
import '$lib/app.css';
import Navbar from '$lib/components/Navbar.svelte';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

let isLoading = $state(false);
let errorMessage = $state('');
</script>
