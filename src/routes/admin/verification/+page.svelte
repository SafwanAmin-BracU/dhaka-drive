<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { applyAction, deserialize } from '$app/forms';
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  export let data: PageData;
  
  // Use a state rune to manage the list of reports locally
  let reports = $state(data.reports);

  // Use an effect to update the local state when the data prop changes (e.g., after successful action)
  $effect(() => {
    reports = data.reports;
  });

  /**
   * Helper function to handle form submission and UI updates without full page reload.
   */
  async function handleSubmit(event: SubmitEvent, action: 'approve' | 'reject', reportId: string) {
    event.preventDefault();

    // 1. Manually construct FormData
    const formData = new FormData();
    formData.append('id', reportId);

    // 2. Submit the form action
    const response = await fetch(
      // URL for the action endpoint: ?/approve or ?/reject
      event.currentTarget.action + `?/${action}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    // 3. Apply the form action result
    const result = deserialize(await response.text());
    applyAction(result);

    // 4. Update the local state to remove the processed report
    if (result.type === 'success') {
      reports = reports.filter(r => r.id !== reportId);
    }
  }

</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">🚦 User Report Verification</h1>
  <p class="mb-4 text-sm text-gray-500">
    Admins can review user-submitted **Incident** reports before they are publicly displayed or used in traffic summaries.
  </p>

  {#if reports.length === 0}
    <p class="text-center py-8 text-lg text-green-600">
      ✅ All reports are currently verified! Check back later.
    </p>
  {:else}
    <h2 class="text-xl font-semibold mb-4">Pending Reports ({reports.length})</h2>
    
    <div class="space-y-6">
      {#each reports as report (report.id)}
        <div class="card p-5 border rounded-lg shadow-md bg-white">
          <header class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-bold text-gray-800">{report.title}</h3>
            <span class="text-sm text-gray-500">
              Reported: {new Date(report.createdAt).toLocaleString()}
            </span>
          </header>
          
          <div class="text-sm space-y-2 mb-4 border-l-4 border-indigo-500 pl-3 py-1">
            <p><strong>Type:</strong> <span class="badge bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">{report.type}</span></p>
            <p><strong>Location:</strong> {report.location}</p>
            <p><strong>Reporter:</strong> {report.reportedBy}</p>
          </div>

          <p class="text-gray-600 mb-5 italic">"{report.description}"</p>

          <form 
            method="POST" 
            class="flex space-x-3" 
            use:enhance
            on:submit={(e) => handleSubmit(e, 'approve', report.id)}
          >
            <button 
              type="submit" 
              formaction="?/approve" 
              class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-150"
            >
              ✅ Approve
            </button>
          </form>

          <form 
            method="POST" 
            class="mt-2" 
            use:enhance
            on:submit={(e) => handleSubmit(e, 'reject', report.id)}
          >
            <button 
              type="submit" 
              formaction="?/reject" 
              class="flex-1 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-150"
            >
              ❌ Reject
            </button>
          </form>
        </div>
      {/each}
    </div>
  {/if}

  {#if $page.form?.error}
    <div class="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
      🚨 Action Error: {$page.form.error}
    </div>
  {/if}
</div>

<style>
  /* You would typically use a framework like Tailwind CSS for these styles */
  .container {
    max-width: 900px;
  }
</style>