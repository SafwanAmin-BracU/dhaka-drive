<svelte:head>
	<title>DhakaDrive - Urban Mobility for Dhaka</title>
	<meta
		name="description"
		content="Traffic reporting, parking management, and vehicle services for Dhaka, Bangladesh."
	/>
</svelte:head>

<div class="min-h-screen bg-base-200">
	<Navbar isAuthenticated={data.isAuthenticated} />

	<main class="container mx-auto px-4 py-12">
		<!-- Hero Section -->
		<section class="hero min-h-[60vh]" aria-labelledby="hero-heading">
			<div class="hero-content text-center">
				<div class="max-w-2xl">
					<h1 id="hero-heading" class="text-5xl font-bold text-base-content">
						Navigate Dhaka with <span class="text-indigo-600">Confidence</span>
					</h1>
					<p class="py-6 text-lg text-base-content/70">
						Real-time traffic updates, smart parking solutions, and reliable vehicle services — all
						in one platform designed for Dhaka's urban mobility needs.
					</p>
					<div class="flex flex-wrap justify-center gap-4">
						<a href="/auth" class="btn btn-lg btn-primary">
							Get Started
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
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								></path>
							</svg>
						</a>
						<a href="/app" class="btn btn-outline btn-lg"> Explore Features </a>
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="py-16" aria-labelledby="features-heading">
			<h2 id="features-heading" class="sr-only">Features</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<article class="card bg-base-100 shadow-md">
					<div class="card-body items-center text-center">
						<div
							class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10"
							aria-hidden="true"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-error"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								></path>
							</svg>
						</div>
						<h3 class="card-title">Traffic Reports</h3>
						<p class="text-base-content/70">
							Real-time traffic updates and incident reports from the community.
						</p>
					</div>
				</article>

				<article class="card bg-base-100 shadow-md">
					<div class="card-body items-center text-center">
						<div
							class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
							aria-hidden="true"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-success"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</div>
						<h3 class="card-title">Smart Parking</h3>
						<p class="text-base-content/70">
							Find and book available parking spots across the city.
						</p>
					</div>
				</article>

				<article class="card bg-base-100 shadow-md">
					<div class="card-body items-center text-center">
						<div
							class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-info/10"
							aria-hidden="true"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-info"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								></path>
							</svg>
						</div>
						<h3 class="card-title">Vehicle Services</h3>
						<p class="text-base-content/70">
							Access trusted mechanics, fuel stations, and emergency assistance.
						</p>
					</div>
				</article>
			</div>
		</section>
	</main>

	<footer class="footer-center footer bg-base-300 p-6 text-base-content">
		<p>&copy; {new Date().getFullYear()} DhakaDrive. Built for Dhaka.</p>
	</footer>
</div>

<script lang="ts">
import '$lib/app.css';
import Navbar from '$lib/components/Navbar.svelte';
import type { PageProps } from './$types';

let { data }: PageProps = $props();
</script>
