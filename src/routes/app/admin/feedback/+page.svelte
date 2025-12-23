<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade } from "svelte/transition";

	let { data } = $props();

	// Derived state for quick stats
	let unreadCount = $derived(data.messages.filter(m => !m.isRead).length);

	const formatDate = (d: Date) =>
		new Date(d).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
</script>

<div class="max-w-5xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold">📬 User Feedback</h1>
			<p class="text-gray-500">Support tickets and general inquiries.</p>
		</div>
		<div class="stats shadow bg-base-100 border border-base-200">
			<div class="stat place-items-center">
				<div class="stat-title">Unread</div>
				<div class="stat-value text-primary">{unreadCount}</div>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		{#if data.messages.length === 0}
			<div class="text-center py-20 opacity-50">
				<div class="text-6xl mb-4">📭</div>
				<p class="text-xl font-medium">Inbox is empty</p>
			</div>
		{:else}
			{#each data.messages as msg (msg.id)}
				<div
					class="card bg-base-100 shadow-sm border transition-all duration-200
                           {msg.isRead
						? 'border-base-200 opacity-90'
						: 'border-primary/40 shadow-md'}"
					transition:fade
				>
					<div class="card-body p-6">
						<div
							class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
						>
							<div class="flex items-center gap-3">
								<div class="avatar placeholder">
									<div
										class="bg-neutral-focus text-neutral-content rounded-full w-10 h-10"
									>
										<span class="text-sm"
											>{msg.name.charAt(0)}</span
										>
									</div>
								</div>
								<div>
									<h3
										class="font-bold text-gray-800 flex items-center gap-2"
									>
										{msg.name}
										{#if !msg.isRead}
											<span
												class="badge badge-primary badge-xs"
												>NEW</span
											>
										{/if}
									</h3>
									<a
										href="mailto:{msg.email}"
										class="text-xs text-blue-500 hover:underline"
									>
										{msg.email}
									</a>
								</div>
							</div>

							<span class="text-xs text-gray-400 font-mono">
								{formatDate(msg.createdAt)}
							</span>
						</div>

						<div class="bg-base-200/50 p-4 rounded-lg mb-4">
							<h4 class="font-bold text-sm mb-1">
								{msg.subject}
							</h4>
							<p
								class="text-gray-600 text-sm whitespace-pre-wrap"
							>
								{msg.message}
							</p>
						</div>

						<div class="card-actions justify-end gap-2">
							<a
								href="mailto:{msg.email}?subject=Re: {msg.subject}"
								class="btn btn-sm btn-ghost gap-2"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
									></path></svg
								>
								Reply
							</a>

							{#if !msg.isRead}
								<form
									method="POST"
									action="?/markRead"
									use:enhance
								>
									<input
										type="hidden"
										name="id"
										value={msg.id}
									/>
									<button
										class="btn btn-sm btn-outline btn-primary"
									>
										Mark as Read
									</button>
								</form>
							{/if}

							<form
								method="POST"
								action="?/delete"
								use:enhance
							>
								<input
									type="hidden"
									name="id"
									value={msg.id}
								/>
								<button
									class="btn btn-sm btn-outline btn-error"
									onclick={e =>
										!confirm("Delete this message?") &&
										e.preventDefault()}
								>
									Delete
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
