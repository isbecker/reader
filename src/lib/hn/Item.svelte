<script lang="ts">
  import CommentCard from "$lib/components/hn/CommentCard.svelte";
  // import { parseComment } from "$lib/types/hn/Comment";
  // import { parseStory } from "$lib/types/hn/Story";
  import { createQuery } from "@tanstack/svelte-query";

  // import type Comment from "$lib/types/hn/Comment";
  // import type Story from "$lib/types/hn/Story";
  // import type * as newStuff from "$lib/types/hn/item";

  import type { Comment, Item } from "$lib/types/hn/item";

  export let id: number;
  export let story: Item | undefined = undefined;
  export let comment: Comment | undefined = undefined;

  const fetchItem = async (id: number): Promise<Item> => {
    if (story) return story;
    if (comment) return comment;

    const res = await fetch(`/api/hn/item/${id}`);
    const itemJson = await res.json();
    if (itemJson.type === "story") {
      return itemJson as Item;
    } else if (itemJson.type === "comment") {
      // console.log(itemJson as newStuff.Item);
      return itemJson as Comment;
    }

    return Promise.reject("Unknown item type");
  };

  const item = createQuery({
    queryKey: ["hn", "item", id],
    queryFn: async () => {
      return await fetchItem(id);
    },
  });
</script>

<div>
  {#if $item.isPending}
    <span class="loading loading-dots loading-lg"></span>
  {:else if $item.isError}
    <div>Error: {$item.error.message}</div>
  {:else if $item.isSuccess}
    <div class="container mx-auto">
      {#if $item.data.type === "story"}
        {$item.data.title}
        <div>{$item.data.url}</div>
        <div>{$item.data.author}</div>
        <div>{$item.data.time}</div>
        <!-- <StoryCard {story} /> -->
      {:else if $item.data.type === "comment"}
        <!-- {$item.data.text} -->
        <CommentCard comment={$item.data} />
      {/if}
      {#if $item.data.kids}
        {#each $item.data.kids as kid}
          <svelte:self id={kid} />
        {/each}
      {/if}
    </div>
  {/if}
</div>
