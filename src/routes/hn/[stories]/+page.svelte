<script lang="ts">
  //   import { initializeApp } from "firebase/app";
  // import { getDatabase, ref, child, get } from "firebase/database";

  // import StoryCard from "../../../components/hn/StoryCard.svelte";
  import { api } from "$lib/api/hn";
  import Stories from "$lib/hn/Stories.svelte";
  import Story from "$lib/hn/Story.svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: kind = data.kind;
  $: skip = data.skip;
  $: size = data.size;

  $: next = skip + size;
  $: prev = skip - size;
  $: {
    // Check if next would go past end of the length of $stories.data
    if ($stories && $stories.isSuccess) {
      const length = $stories.data.length;
      if (next >= length) {
        next = -1;
      }
      if (prev < 0) {
        prev = -1;
      }
    }
  }

  const skeletonStories = Array(30).fill(0);

  $: stories = createQuery({
    queryKey: ["hn", "stories", kind],
    queryFn: () => api().getStories(kind),
  });

  // const firebaseConfig = {
  //   databaseURL: "https://hacker-news.firebaseio.com",
  // };
  // const app = initializeApp(firebaseConfig);
  // const database = getDatabase(app);
  // const dbRef = ref(database);
  // get(child(dbRef, "v0/item/39210507"))
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log(snapshot.val());
  //     } else {
  //       console.log("No data available");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
</script>

<svelte:head>
  <title>beckr.dev - Hacker News - {kind}</title>
</svelte:head>

<div>
  {#key kind}
    {#if $stories.isLoading}
      {#each skeletonStories as id}
        <Story {id} />
      {/each}
    {:else if $stories.isSuccess}
      {#key skip}
        <Stories
          storyKind={kind}
          initialStories={$stories.data}
          {skip}
          {size} />
        <div class="flex flex-row w-full justify-center p-4 gap-4">
          {#if prev >= 0}
            <a class="btn btn-accent" href="?skip={prev}&size={size}">prev</a>
          {/if}
          {#if next > 0}
            <a class="btn btn-accent" href="?skip={next}&size={size}">next</a>
          {/if}
        </div>
      {/key}
    {:else if $stories.isError}
      <div>Error: {$stories.error.message}</div>
    {/if}
  {/key}
</div>

<!-- <div>
  <div class="flex flex-col place-items-center">
    {#await data.stories}
      <span class="loading loading-dots loading-lg"></span>
    {:then stories}
      {#each stories as story}
        <div class="container mx-auto">
          <StoryCard {story} />
        </div>
      {/each}
    {/await}
  </div>
</div> -->
