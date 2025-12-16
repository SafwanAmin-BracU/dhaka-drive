<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
	let isSubmitting = false;
</script>

<div class="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
	<div class="max-w-xl w-full">
		
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-3xl font-bold text-primary">Report Incident</h1>
				<p class="text-base-content/70">Submit a new traffic report</p>
			</div>
			<a href="/incidents/dashboard" class="btn btn-secondary btn-outline">
				View Dashboard
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
				</svg>
			</a>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
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
						<label class="label" for="title"><span class="label-text">Title</span></label>
						<input type="text" name="title" placeholder="e.g. Car Crash" class="input input-bordered" required />
					</div>

					<div class="form-control">
						<label class="label" for="type"><span class="label-text">Type</span></label>
						<select name="type" class="select select-bordered" required>
							<option disabled selected>Select type</option>
							<option value="Accident">Accident</option>
							<option value="Roadblock">Roadblock</option>
							<option value="Hazard">Hazard</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label" for="location"><span class="label-text">Location</span></label>
						<input type="text" name="location" placeholder="e.g. Main St" class="input input-bordered" required />
					</div>

					<div class="form-control">
						<label class="label" for="description"><span class="label-text">Description</span></label>
						<textarea name="description" class="textarea textarea-bordered h-24" required></textarea>
					</div>

					<div class="form-control">
						<label class="label" for="photoUrl"><span class="label-text">Photo URL (Optional)</span></label>
						<input type="url" name="photoUrl" placeholder="https://..." class="input input-bordered" />
					</div>

					{#if form?.success}
						<div role="alert" class="alert alert-success text-sm"><span>Report submitted! Check the dashboard.</span></div>
					{/if}

					<button class="btn btn-primary mt-2" disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Submit Report'}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>