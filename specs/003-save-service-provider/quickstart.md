# Phase 1: Implementation Quickstart

**Status**: Ready for Development  
**Date**: 2026-01-07  
**Feature**: Save Service Provider from Booking Panel

## Overview

This guide provides a step-by-step walkthrough to implement the "Save Service Provider" feature. Follow the phases in order; each phase builds on the previous one.

**Estimated Implementation Time**: 2-3 hours  
**Complexity**: Low-Medium (simple CRUD operations, straightforward UI updates)

---

## Phase 1a: Add Server Functions

### Step 1: Add Query Function

**File**: `src/lib/server/services/queries.ts`

Add this function to check if a provider is saved by a user:

```typescript
import { and, eq } from "drizzle-orm";
import { db } from "$lib/drizzle";
import { savedProviders } from "$lib/drizzle/schema";

export async function checkProviderSaveStatus(
  userId: string,
  providerId: number
) {
  const result = await db
    .select({ id: savedProviders.id })
    .from(savedProviders)
    .where(
      and(
        eq(savedProviders.userId, userId),
        eq(savedProviders.providerId, providerId)
      )
    )
    .limit(1);

  return {
    isSaved: result.length > 0,
    savedId: result[0]?.id,
  };
}
```

### Step 2: Add Mutation Functions

**File**: `src/lib/server/services/mutations.ts`

Add these functions to save/unsave providers:

```typescript
import { and, eq } from "drizzle-orm";
import { db } from "$lib/drizzle";
import { savedProviders } from "$lib/drizzle/schema";

export async function saveProvider(
  userId: string,
  providerId: number
) {
  const result = await db
    .insert(savedProviders)
    .values({
      userId,
      providerId,
    })
    .onConflictDoNothing()
    .returning();

  return result[0] || null;
}

export async function unsaveProvider(
  userId: string,
  providerId: number
) {
  const result = await db
    .delete(savedProviders)
    .where(
      and(
        eq(savedProviders.userId, userId),
        eq(savedProviders.providerId, providerId)
      )
    )
    .returning({ id: savedProviders.id });

  return result[0] || null;
}
```

---

## Phase 1b: Create Form Actions

### Step 3: Create Server Actions

**File**: `src/routes/app/services/book/[id]/+server.ts`

Create this new file with form actions for save/unsave:

```typescript
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { saveProvider, unsaveProvider } from "$lib/server/services/mutations";
import { checkProviderSaveStatus } from "$lib/server/services/queries";
import { z } from "zod";

const saveProviderSchema = z.object({
  providerId: z.coerce.number().int().positive(),
  action: z.enum(["save", "unsave"]),
});

export const POST: RequestHandler = async (event) => {
  const userId = event.locals.user?.id;

  if (!userId) {
    return json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await event.request.formData();
    const providerId = formData.get("providerId");
    const action = formData.get("action");

    const validated = saveProviderSchema.parse({
      providerId,
      action,
    });

    let result;
    if (validated.action === "save") {
      result = await saveProvider(userId, validated.providerId);
    } else {
      result = await unsaveProvider(userId, validated.providerId);
    }

    // Fetch updated status
    const status = await checkProviderSaveStatus(userId, validated.providerId);

    return json({
      success: true,
      action: validated.action,
      providerId: validated.providerId,
      isSaved: status.isSaved,
      message: validated.action === "save" 
        ? "Provider saved successfully!"
        : "Provider removed from saved list.",
    });
  } catch (err) {
    console.error("Save provider error:", err);
    return json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
};
```

---

## Phase 1c: Create Reusable Component

### Step 4: Create SaveProviderButton Component

**File**: `src/lib/components/SaveProviderButton.svelte`

Create a reusable button component:

```svelte
<script lang="ts">
  import { enhance } from "$app/forms";

  interface Props {
    providerId: number;
    providerName: string;
  }

  let { providerId, providerName }: Props = $props();

  let isSaved = $state(false);
  let isLoading = $state(false);
  let successMessage = $state("");

  // Check initial save status on mount
  onMount(async () => {
    try {
      const response = await fetch(`/api/provider-save-status?providerId=${providerId}`, {
        method: "GET",
      });
      
      if (response.ok) {
        const data = await response.json();
        isSaved = data.isSaved;
      }
    } catch (err) {
      console.error("Error checking save status:", err);
    }
  });

  function handleToggleSave(e: Event) {
    const form = e.currentTarget as HTMLFormElement;
    
    return async ({ update }) => {
      isLoading = true;
      successMessage = "";
      
      try {
        // Form will submit via enhance
        await update();
        
        // After successful submission, toggle state
        const formData = new FormData(form);
        const action = formData.get("action") as string;
        
        if (action === "save") {
          isSaved = true;
          successMessage = `${providerName} saved!`;
        } else {
          isSaved = false;
          successMessage = `${providerName} removed from saved.`;
        }
        
        // Clear message after 2 seconds
        setTimeout(() => {
          successMessage = "";
        }, 2000);
      } catch (err) {
        console.error("Error saving provider:", err);
      } finally {
        isLoading = false;
      }
    };
  }
</script>

<div class="flex flex-col gap-2">
  <form method="POST" use:enhance={handleToggleSave}>
    <input type="hidden" name="providerId" value={providerId} />
    <input type="hidden" name="action" value={isSaved ? "unsave" : "save"} />
    
    <button
      type="submit"
      disabled={isLoading}
      class={`btn btn-sm gap-2 ${
        isSaved
          ? "btn-primary"
          : "btn-ghost"
      }`}
    >
      {#if isLoading}
        <span class="loading loading-spinner loading-sm"></span>
      {:else if isSaved}
        <span>❤️</span> Unsave
      {:else}
        <span>🔖</span> Save Provider
      {/if}
    </button>
  </form>

  {#if successMessage}
    <div class="alert alert-success alert-sm py-2">
      <span>{successMessage}</span>
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount } from "svelte";
</script>
```

---

## Phase 1d: Integrate into Booking Panel

### Step 5: Update Booking Panel UI

**File**: `src/routes/app/services/book/[id]/+page.svelte`

Import and add the SaveProviderButton component near the provider info:

```svelte
<script lang="ts">
  import SaveProviderButton from "$lib/components/SaveProviderButton.svelte";
  
  // ... existing imports and code ...
</script>

<!-- In the provider info section of the card, add this: -->
<div class="card-body md:w-3/5">
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1">
      <h3 class="card-title text-2xl mb-1">Schedule Appointment</h3>
      <p class="text-xs text-gray-500 mb-6">
        Book a slot for your vehicle maintenance.
      </p>
    </div>
    
    <!-- Add save button here -->
    <SaveProviderButton 
      providerId={data.provider.id}
      providerName={data.provider.name}
    />
  </div>

  <!-- Rest of form unchanged -->
  <form
    method="POST"
    use:enhance={() => {
      loading = true;
      return async ({ update }) => {
        await update();
        loading = false;
      };
    }}
    class="space-y-4"
  >
    {/* existing form content */}
  </form>
</div>
```

---

## Phase 1e: Update Saved Providers List (Optional)

### Step 6: Add Remove Action to Saved List

**File**: `src/routes/app/services/saved/+page.svelte`

The saved providers list already displays providers. Optionally add remove action:

```svelte
<!-- In the card actions section for each provider -->
<div class="card-actions justify-between mt-4">
  <a
    href="/app/services/book/{provider.providerId}"
    class="btn btn-primary btn-sm"
  >
    Book Now
  </a>
  
  <!-- Add remove button -->
  <form method="POST" action="?/removeSavedProvider">
    <input type="hidden" name="providerId" value={provider.providerId} />
    <button type="submit" class="btn btn-ghost btn-sm btn-error">
      Remove
    </button>
  </form>
</div>
```

Then add action handler in `+page.server.ts`:

```typescript
export const actions = {
  removeSavedProvider: async (event) => {
    const userId = event.locals.user?.id;
    if (!userId) return fail(401);

    const data = await event.request.formData();
    const providerId = parseInt(data.get("providerId") as string);

    await unsaveProvider(userId, providerId);
    return { success: true };
  },
};
```

---

## Testing Checklist

- [ ] **Save Provider**: Click save button on booking panel → button changes to "unsave" → appears in saved list
- [ ] **Unsave Provider**: Click unsave button → button changes to "save" → removed from saved list
- [ ] **Duplicate Save**: Save → leave page → return → save again → no error
- [ ] **Authentication**: Log out → try to save → redirected to login
- [ ] **Error States**: Disconnect network during save → error message shown, button state reverts
- [ ] **UI Responsiveness**: Loading spinner shows during save, button disabled during operation
- [ ] **Saved List Updates**: After saving on booking panel, navigate to saved list → provider appears
- [ ] **Cross-browser**: Test on Chrome, Firefox, Safari (if applicable)

---

## Deployment Checklist

- [ ] All TypeScript code compiles without errors
- [ ] All Zod schemas validate correctly
- [ ] Database mutations work without FK constraint errors
- [ ] SaveProviderButton component renders without console errors
- [ ] Form actions return correct HTTP status codes
- [ ] Success/error messages display correctly
- [ ] Button styling matches DaisyUI theme
- [ ] Responsive design works on mobile/tablet/desktop

---

## Useful Commands

```bash
# Run type checking
bun run check

# Build for production
bun run build

# Start development server
bun run dev

# View database schema
bun run migrations:status
```

---

## Git Workflow

```bash
# Create feature branch (already done: 003-save-service-provider)
git checkout -b 003-save-service-provider

# Commit changes incrementally
git add src/lib/server/services/
git commit -m "feat: add save/unsave provider server functions"

git add src/routes/app/services/book/[id]/
git commit -m "feat: add save provider form action"

git add src/lib/components/SaveProviderButton.svelte
git commit -m "feat: create SaveProviderButton component"

# Push to remote
git push origin 003-save-service-provider

# Create pull request on GitHub
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Button not showing save status | Check that `checkProviderSaveStatus` query runs on component mount |
| Form action not firing | Verify form has `method="POST"` and button has `type="submit"` |
| Zod validation fails | Ensure form fields match schema exactly (`providerId` as number, `action` as string) |
| FK constraint error | Verify `providerId` exists in `serviceProviders` table |
| Style issues | Ensure DaisyUI classes are spelled correctly; check Tailwind config |

---

## References

- [Data Model Specification](./data-model.md) — Entity definitions and validation
- [Feature Specification](./spec.md) — Requirements and acceptance criteria
- [Research Document](./research.md) — Technical background and decisions
