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
					<button type="button" class="btn mx-auto flex btn-wide" onclick={handleGoogleSignIn}>
						Sign in with Google
					</button>
				</div>
			</div>
		</div>
	</main>
</div>

<script lang="ts">
import '$lib/app.css';
import { authClient } from '$lib/auth-client';
import Navbar from '$lib/components/Navbar.svelte';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

let isLoading = $state(false);
let errorMessage = $state('');

const handleGoogleSignIn = async () => {
	console.log('Initiating Google Sign-In');
	await authClient.signIn.social({ provider: 'google' });
};
</script>
