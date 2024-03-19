<script lang="ts">
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
  // import StoryCard from '../../components/hn/StoryCard.svelte';
  // import type Story from '../../types/hn/Story';
  import Story from "./Story.svelte";

  export let storyKind: string | undefined;
  export let initialStories: number[] = [];

  const client = useQueryClient();
  const stories = createQuery({
    queryKey: ["stories", storyKind],
    queryFn: async () => {
      return await fetch(`/api/hn/${storyKind}`)
        .then(async (res) => await res.json())
        .then(async (ids) => {
          return ids.slice(0, 30);
        });
      // .then(async (top) =>
      //   await Promise.all(top.slice(0, 30)
      //     .map(async (story: number) => {
      //       return await fetch(`/api/hn/item/${story}`)
      //         .then((res) => res.json())
      //         .then((story) => parseStory(story));
      //     })
      //   )
      // )
    },
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
    {#each $stories.data as id}
      <div class="container mx-auto">
        <!-- <div>{client.getQueryData(['stories', storyKind]) ? 'Cached': 'New'}</div> -->
        <Story {id} />
      </div>
    {/each}
  {/if}
</div>
