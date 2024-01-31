<script lang="ts">
  import StoryCard from "../../../components/hn/StoryCard.svelte";

  export let data;

  let hn = data.storyList;
</script>

<div>
  <div class="flex flex-col place-items-center">
    {#await hn}
      <span class="loading loading-dots loading-lg"></span>
    {:then stories}
      {#each stories as story}
        <div class="container mx-auto"> 
          <StoryCard {story} />
        </div>
      {/each}
    {/await}
  </div>
</div>
