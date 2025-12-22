<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
	let isSubmitting = $state(false);
</script>

<div class="flex flex-col items-center justify-center py-6">
	<div class="text-center mb-8 max-w-2xl">
		<h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Report an Incident</h2>
		<p class="text-slate-500 mt-2">
			Help keep Dhaka moving. Report accidents, roadblocks, or hazards in real-time.
		</p>
	</div>

	<div class="card bg-white w-full max-w-3xl shadow-xl border border-slate-200 overflow-hidden">
		<div class="h-2 bg-indigo-600 w-full"></div>

		<div class="card-body p-8">
			<div class="flex justify-end mb-4">
				<a href="/incidents/dashboard" class="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
					View Live Dashboard &rarr;
				</a>
			</div>

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
				class="space-y-6"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="form-control">
						<label class="label font-semibold text-slate-700" for="title">Title</label>
						<input
							type="text"
							name="title"
							placeholder="e.g. Minor Collision"
							class="input input-bordered w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
							required
						/>
					</div>

					<div class="form-control">
						<label class="label font-semibold text-slate-700" for="type">Incident Type</label>
						<select name="type" class="select select-bordered w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 text-slate-700" required>
							<option disabled selected>Select Category</option>
							<option value="Accident">🚗 Accident</option>
							<option value="Roadblock">⛔ Roadblock</option>
							<option value="Hazard">⚠️ Hazard</option>
							<option value="Construction">🚧 Construction</option>
						</select>
					</div>
				</div>

				<div class="form-control">
					<label class="label font-semibold text-slate-700" for="location">Location</label>
					<div class="relative">
						<span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
							📍
						</span>
						<input
							type="text"
							name="location"
							placeholder="e.g. Gulshan 1 Circle"
							class="input input-bordered w-full pl-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
							required
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label font-semibold text-slate-700" for="description">Description</label>
					<textarea
						name="description"
						class="textarea textarea-bordered w-full h-40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 text-base leading-relaxed p-4 shadow-sm"
						placeholder="Please describe the incident details here..."
						required
					></textarea>
				</div>

				{#if form?.success}
					<div role="alert" class="alert alert-success bg-emerald-50 text-emerald-800 border-emerald-200">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						<span>Report submitted successfully! Thank you for contributing.</span>
					</div>
				{/if}

				<div class="pt-2">
					<button 
						class="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full border-none text-lg shadow-md hover:shadow-lg transition-all"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Submitting...' : 'Submit Report'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>