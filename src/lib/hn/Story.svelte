<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import StoryCard from "$lib/components/hn/StoryCard.svelte";
  import type Story from "$lib/types/hn/Story";
  import { parseStory } from "$lib/types/hn/Story";
  import type {Item} from "$lib/types/hn/item";

  export let id: number;

  const fetchStory = async (id: number): Promise<Item> => {
    const res = await fetch(`/api/hn/post/${id}`);
    const storyJson = await res.json();
    return storyJson as Item
  };

  const story = createQuery<Item>({
    queryKey: ["story", id],
    queryFn: async () => {
      return await fetchStory(id);
    },
  });
</script>

<div class="container mx-auto">
  {#if $story.isPending}
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
            <div
              class="skeleton btn-xs md:btn-sm sm:btn-xs lg:btn-md w-10"
            ></div>
            <div
              class="skeleton btn-xs md:btn-sm sm:btn-xs lg:btn-md w-36"
            ></div>
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
