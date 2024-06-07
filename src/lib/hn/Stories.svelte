<script lang="ts">
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
  // import StoryCard from '../../components/hn/StoryCard.svelte';
  // import type Story from '../../types/hn/Story';
  import { api } from "$lib/api/hn";
  import Story from "./Story.svelte";

  export let storyKind: string = "top";
  export let initialStories: number[] = [];
  export let skip: number = 0;
  export let size: number = 30;

  const stories = createQuery({
    queryKey: ["hn", "stories", storyKind],
    queryFn: () => api().getStories(storyKind),
    initialData: initialStories,
  });

</script>

<div class="flex flex-col place-items-center">
  {#if $stories.isPending}
    {#each initialStories as id}
      <div class="container mx-auto">
        <Story {id} />
      </div>
    {/each}
  {:else if $stories.isError}
    <div>Error: {$stories.error.message}</div>
  {:else if $stories.isSuccess}
    {#each $stories.data.slice(skip, skip + size) as id}
      <div class="container mx-auto">
        <!-- <div>{client.getQueryData(['stories', storyKind]) ? 'Cached': 'New'}</div> -->
        <Story {id} />
      </div>
    {/each}
  {/if}
</div>
