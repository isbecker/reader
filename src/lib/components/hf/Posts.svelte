<script lang="ts">
  import type { SocialPostsData } from "$lib/hf/PostParser";
  import PostCard from "./PostCard.svelte";
  export let posts: SocialPostsData;
</script>

<div class="flex flex-col">
  {#each posts.socialPosts as post}
    <div>
      <div class="container mx-auto">
        <PostCard {post} />
      </div>
    </div>
  {/each}
</div>
