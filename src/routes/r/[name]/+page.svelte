<script lang="ts">
  import PostCard from "../../../components/PostCard.svelte";

  export let data;

</script>

{#if data.subreddit}
  <ul>
    {#each data.subreddit.posts as post}
      <li class="hover:bg-base-300">
        <div>
          <PostCard {post} />
        </div>
      </li>
    {/each}
  </ul>
{/if}
