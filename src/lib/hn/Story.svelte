<script lang="ts">
  import StoryCard from "$lib/components/hn/StoryCard.svelte";
  import type { Item } from "$lib/types/hn/item";
  import { createQuery } from "@tanstack/svelte-query";

  export let id: number;

  const fetchStory = async (id: number): Promise<Item> => {
    if (id === 0) return {} as Item; // For skeleton loading

    const res = await fetch(`/api/hn/item/${id}`);
    const storyJson = await res.json();
    return storyJson as Item;
  };

  const story = createQuery<Item>({
    queryKey: ["hn", "item", id],
    queryFn: async () => {
      return await fetchStory(id);
    },
  });
</script>

<div class="container mx-auto">
  {#if $story.isPending || id === 0}
    <div class="">
      <div class="card card-bordered card-compact">
        <div class="card-body">
          <div class="card-title">
            <div class="flex flex-col gap-1 place-items-start">
              <div class="join gap-1">
                <div class="skeleton h-6 w-32 sm:w-72 md:w-80 lg:w-96"></div>
                <div class="skeleton h-3 w-12 self-center"></div>
              </div>
              <div class="join gap-1">
                <div class="skeleton h-3 w-20"></div>
                <div class="skeleton h-3 w-20"></div>
                <div class="skeleton h-3 w-20"></div>
              </div>
            </div>
          </div>
          <div class="card-actions justify-end">
            <div class="skeleton btn-xs md:btn-sm sm:btn-xs lg:btn-md w-10">
            </div>
            <div class="skeleton btn-xs md:btn-sm sm:btn-xs lg:btn-md w-36">
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if $story.isError}
    <div>Error: {$story.error.message}</div>
  {:else if $story.isSuccess}
    <StoryCard story={$story.data} />
    <!-- <Item id={$story.data.id} story={$story.data} /> -->
  {/if}
</div>
