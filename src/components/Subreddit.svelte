<script lang="ts">
  import { onMount } from "svelte";
  import type Subreddit from "../types/reddit/Subreddit";
  import { parseSubreddit } from "../types/reddit/Subreddit";
  import PostCard from "./PostCard.svelte";

  export let subredditName: string = "";
  let subreddit: Subreddit;

  onMount(async () => {
    let subJson = await changeSubreddit(subredditName);
  });

  $: {
    if (subreddit?.name !== subredditName) {
      // changeSubreddit(subredditName);
    }
  }

  async function changeSubreddit(sub: string) {
    let rawSubreddit = await fetchSubreddit(sub);
    subreddit = await parseSubreddit(sub, rawSubreddit);
  }

  async function fetchSubreddit(subreddit: string): Promise<any> {
    try {
      const response = await fetch(`/api/reddit/${subreddit}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>

<div class="bg-base-100 min-w-full min-h-fit">
  <div class="underline text-secondary font-bold">
    r/{subredditName}
  </div>
  <ul class="flex flex-col gap-4">
    {#if subreddit}
      {#each subreddit.posts as post}
        <li class="hover:bg-base-300">
          <PostCard {post} />
        </li>
      {/each}
    {/if}
  </ul>
</div>
