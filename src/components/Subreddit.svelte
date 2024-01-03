<script lang="ts">
  import { onMount } from "svelte";
  import SvelteMarkdown from "svelte-markdown";
  import type Post from "../types/reddit/Post";
  import type Subreddit from "../types/reddit/Subreddit";
  import { parseSubreddit } from "../types/reddit/Subreddit";
    import PostCard from "./PostCard.svelte";

  export let subredditName: string;
  let subreddit: Subreddit;

  onMount(async () => {
    let subJson = await changeSubreddit(subredditName);
    // console.log(`Subreddit: ${subJson}`);
  });

  async function changeSubreddit(sub: string) {
    let rawSubreddit = await fetchSubreddit(sub);
    subreddit = await parseSubreddit(rawSubreddit);

  }

  async function fetchReadableContent(post: Post): Promise<any> {
    let response = await fetch(`/api/content/readable?url=${post.url}`);
    if (response.ok) {
      let data = await response.json();
      return data.article ?? data.error;
    } else {
      throw new Error("Failed to fetch");
    }
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
  <div class="underline text-secondary font-bold">r/{subredditName}</div>
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
