<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	// Svelte 5: Get data using $props rune
	let { data }: { data: PageData } = $props();

	// Helper to format dates cleanly
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	};
</script>

<div class="container">
	<header class="header">
		<h1>Report Verification Queue</h1>
		<p class="subtitle">
			Review and manage user-submitted traffic incidents.
		</p>
	</header>

	{#if data.incidents.length === 0}
		<div class="empty-state">
			<p>🎉 All caught up! No active reports to review.</p>
		</div>
	{:else}
		<div class="grid">
			{#each data.incidents as incident (incident.id)}
				<div class="card">
					<div class="card-header">
						<span class="badge {incident.type.toLowerCase()}"
							>{incident.type}</span
						>
						<span class="timestamp"
							>{formatDate(incident.createdAt)}</span
						>
					</div>

					<div class="card-body">
						<h2>{incident.title}</h2>
						<p class="location">📍 {incident.location}</p>
						<p class="description">{incident.description}</p>

						{#if incident.photoUrl}
							<div class="image-preview">
								<img
									src={incident.photoUrl}
									alt="Incident evidence"
								/>
							</div>
						{/if}

						{#if incident.reportedBy}
							<p class="reporter">
								<small>Reported by: {incident.reportedBy}</small
								>
							</p>
						{/if}
					</div>

					<div class="card-actions">
						<form
							method="POST"
							use:enhance
							class="action-form"
						>
							<input
								type="hidden"
								name="id"
								value={incident.id}
							/>

							<button
								class="btn reject"
								formaction="?/reject"
								aria-label="Reject report"
							>
								Reject
							</button>

							<button
								class="btn approve"
								formaction="?/approve"
								aria-label="Approve report"
							>
								Approve
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.header {
		margin-bottom: 2rem;
	}

	.subtitle {
		color: #666;
		margin-top: 0.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.card {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.card-header {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f8fafc;
		border-bottom: 1px solid #e2e8f0;
	}

	.badge {
		background: #e2e8f0;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	/* Example dynamic badge color */
	.badge.accident {
		background: #fee2e2;
		color: #991b1b;
	}
	.badge.traffic {
		background: #fef3c7;
		color: #92400e;
	}

	.timestamp {
		font-size: 0.875rem;
		color: #64748b;
	}

	.card-body {
		padding: 1rem;
		flex: 1;
	}

	h2 {
		font-size: 1.125rem;
		margin: 0 0 0.5rem 0;
	}

	.location {
		color: #475569;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #334155;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.image-preview img {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-radius: 8px;
		margin-top: 1rem;
	}

	.reporter {
		margin-top: 1rem;
		color: #94a3b8;
	}

	.card-actions {
		padding: 1rem;
		border-top: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.action-form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.btn {
		padding: 0.5rem;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.btn:hover {
		opacity: 0.9;
	}

	.approve {
		background-color: #22c55e;
		color: white;
	}

	.reject {
		background-color: #ef4444;
		color: white;
	}

	.empty-state {
		text-align: center;
		padding: 4rem;
		background: #f8fafc;
		border-radius: 12px;
		color: #64748b;
	}
</style>
