<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	
	let { form }: { form: ActionData } = $props();
	let loading = $state(false);

	const submitHandler = () => {
		loading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			loading = false;
		};
	};
</script>

<div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
	<div class="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
		
		<div class="bg-blue-600 p-6 text-center">
			<h1 class="text-2xl font-bold text-white">DhakaDrive Support</h1>
			<p class="text-blue-100 text-sm">Emergency Roadside Assistance</p>
		</div>

		{#if form?.success && form?.provider}
			<div class="p-6 text-center space-y-4">
				<div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
				
				<h2 class="text-xl font-bold text-gray-800">Help is on the way!</h2>
				<p class="text-gray-600 text-sm">We matched you with a verified expert.</p>
				
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-5 text-left mt-4 shadow-sm">
					<h3 class="font-bold text-lg text-blue-900">{form.provider.name}</h3>
					<div class="flex items-center space-x-2 text-sm text-gray-700 mt-1">
						<span class="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{form.provider.specialty}</span>
						<span>⭐ {form.provider.rating}</span>
					</div>
					
					<div class="mt-4 pt-3 border-t border-blue-200">
						<p class="text-xs text-gray-500 uppercase font-bold tracking-wide">Driver Contact</p>
						<p class="text-2xl font-mono font-bold text-blue-700 mt-1">{form.provider.phone}</p>
					</div>
				</div>

				<button 
					onclick={() => window.location.reload()} 
					type="button"
					class="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-900 underline"
				>
					Request Assistance Again
				</button>
			</div>

		{:else}
			<form method="POST" use:enhance={submitHandler} class="p-6 space-y-4">
				{#if form?.missing}
					<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
						Please fill in all fields
					</div>
				{/if}

				<div>
					<label for="userName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
					<input 
						type="text" 
						id="userName"
						name="userName" 
						required 
						class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
						placeholder="Mahir Jawad" 
					/>
				</div>

				<div>
					<label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
					<input 
						type="tel" 
						id="contactInfo"
						name="contactInfo" 
						required 
						class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
						placeholder="017..." 
					/>
				</div>

				<div>
					<label for="issueType" class="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
					<select 
						name="issueType"
						id="issueType" 
						class="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
					>
						<option value="Towing">Towing Service</option>
						<option value="Flat Tire">Flat Tire</option>
						<option value="Dead Battery">Dead Battery</option>
						<option value="Engine Trouble">Engine Trouble</option>
					</select>
				</div>

				<div>
					<label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
					<input 
						type="text" 
						id="location"
						name="location" 
						required 
						class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
						placeholder="e.g. Gulshan 1" 
					/>
				</div>

				<button 
					disabled={loading} 
					type="submit" 
					class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-all shadow-md"
				>
					{#if loading}
						Searching Nearby Providers...
					{:else}
						Request Assistance
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>