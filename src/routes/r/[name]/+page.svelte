<script lang="ts">
  import PostCard from "../../../components/PostCard.svelte";

  export let data;

</script>

{#if data.subreddit}
  <div class="flex flex-col">
    {#each data.subreddit.posts as post}
      <div>
        <div class="container mx-auto">
          <PostCard {post} />
        </div>
      </div>
    {/each}
  </div>
{/if}
