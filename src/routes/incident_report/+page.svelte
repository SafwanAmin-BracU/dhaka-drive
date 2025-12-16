<script lang="ts">
	import { enhance } from '$app/forms';

	
	let { data, form } = $props();

	
	let incidents = $derived(data.incidents);

	
	let isSubmitting = $state(false);
</script>

<div class="min-h-screen bg-base-200 p-4 md:p-8">
	<header class="mb-8 text-center">
		<h1 class="text-4xl font-bold text-primary">CityWatch</h1>
		<p class="text-base-content/70 mt-2">Real-time Traffic & Incident Reporting Dashboard</p>
	</header>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
		
		<div class="lg:col-span-1">
			<div class="card bg-base-100 shadow-xl sticky top-8">
				<div class="card-body">
					<h2 class="card-title mb-4">Report an Incident</h2>

					<form
						method="POST"
						action="?/create"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								await update();
								isSubmitting = false;
							};
						}}
						class="flex flex-col gap-4"
					>
						<div class="form-control">
							<label class="label" for="title">
								<span class="label-text">Title</span>
							</label>
							<input
								type="text"
								name="title"
								placeholder="e.g. Car Crash on Hwy 4"
								class="input input-bordered w-full"
								required
							/>
						</div>

						<div class="form-control">
							<label class="label" for="type">
								<span class="label-text">Incident Type</span>
							</label>
							<select name="type" class="select select-bordered w-full" required>
								<option disabled selected>Select type</option>
								<option value="Accident">Accident</option>
								<option value="Roadblock">Roadblock</option>
								<option value="Hazard">Hazard</option>
								<option value="Construction">Construction</option>
							</select>
						</div>

						<div class="form-control">
							<label class="label" for="location">
								<span class="label-text">Location</span>
							</label>
							<input
								type="text"
								name="location"
								placeholder="e.g. Main St & 5th Ave"
								class="input input-bordered w-full"
								required
							/>
						</div>

						<div class="form-control">
							<label class="label" for="description">
								<span class="label-text">Description</span>
							</label>
							<textarea
								name="description"
								class="textarea textarea-bordered h-24"
								placeholder="Describe the situation..."
								required
							></textarea>
						</div>

						<div class="form-control">
							<label class="label" for="photoUrl">
								<span class="label-text">Photo URL (Optional)</span>
							</label>
							<input
								type="url"
								name="photoUrl"
								placeholder="https://..."
								class="input input-bordered w-full"
							/>
						</div>

						{#if form?.missing}
							<div role="alert" class="alert alert-warning text-sm">
								<span>{form.message}</span>
							</div>
						{/if}
						
						{#if form?.success}
							<div role="alert" class="alert alert-success text-sm">
								<span>Report submitted successfully!</span>
							</div>
						{/if}

						<button class="btn btn-primary mt-4" disabled={isSubmitting}>
							{#if isSubmitting}
								<span class="loading loading-spinner"></span>
								Submitting...
							{:else}
								Submit Report
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>

		<div class="lg:col-span-2">
			<h2 class="text-2xl font-bold mb-6">Recent Reports</h2>

			{#if incidents.length === 0}
				<div class="alert">
					<span>No active incidents reported yet. Drive safely!</span>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each incidents as incident (incident.id)}
						<div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-200">
							{#if incident.photoUrl}
								<figure class="h-48 overflow-hidden">
									<img src={incident.photoUrl} alt="Incident" class="w-full h-full object-cover" />
								</figure>
							{/if}
							
							<div class="card-body">
								<div class="flex justify-between items-start">
									<h3 class="card-title text-lg">{incident.title}</h3>
									
									<div class={`badge ${
										incident.type === 'Accident' ? 'badge-error' : 
										incident.type === 'Roadblock' ? 'badge-warning' : 'badge-neutral'
									} gap-2`}>
										{incident.type}
									</div>
								</div>

								<p class="text-sm text-base-content/70 flex items-center gap-1 mt-1">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
										<path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001.003.001zM7 9a3 3 0 116 0 3 3 0 01-6 0z" clip-rule="evenodd" />
									</svg>
									{incident.location}
								</p>

								<p class="mt-2 text-sm">{incident.description}</p>

								<div class="card-actions justify-end mt-4 items-center w-full">
									<span class="text-xs text-base-content/50 mr-auto">
										{new Date(incident.createdAt).toLocaleDateString()}
									</span>
									<div class="badge badge-outline badge-sm">{incident.status}</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>