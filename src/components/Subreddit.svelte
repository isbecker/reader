<script lang="ts">
  import type Subreddit from "../types/reddit/Subreddit";
  import { parseSubreddit } from "../types/reddit/Subreddit";
  import PostCard from "./PostCard.svelte";

  export let subredditName: string;
  let subreddit: Promise<Subreddit | undefined> =
    changeSubreddit(subredditName);

  $: if (subredditName) {
    subreddit = changeSubreddit(subredditName);
  }

  async function changeSubreddit(sub: string): Promise<Subreddit | undefined> {
    return await fetchSubreddit(sub).then(
      async (s) => await parseSubreddit(sub, s),
    );
  }

  async function fetchSubreddit(subreddit: string): Promise<any> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`/api/reddit/${subreddit}`);
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        console.error("Error:", error);
        retryCount++;
      }
    }

    return null;
  }
</script>

<div class="bg-base-100 min-w-full min-h-fit">
  {#await subreddit}
    <div class="text-primary">Loading {subredditName}</div>
  {:then subreddit}
    <ul class="flex flex-col gap-4">
      {#if subreddit}
        {#each subreddit.posts as post}
          <li class="hover:bg-base-300">
            <PostCard {post} />
          </li>
        {/each}
      {/if}
    </ul>
  {:catch error}
    <div class="text-primary">
      {error.message}
    </div>
  {/await}
</div>
