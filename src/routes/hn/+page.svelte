<script lang="ts">
  import StoryCard from "../../components/hn/StoryCard.svelte";

  export let data;

  let hn = data.stories;
</script>

<div class="h-full w-full">
  <ul>
    {#await hn}
      <span class="loading loading-dots loading-lg"></span>
    {:then stories}
      {#each stories as story}
        <li>
          <StoryCard {story} />
        </li>
      {/each}
    {/await}
  </ul>
</div>
