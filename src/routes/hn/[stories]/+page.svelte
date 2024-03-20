<script lang="ts">
  //   import { initializeApp } from "firebase/app";
  // import { getDatabase, ref, child, get } from "firebase/database";

  // import StoryCard from "../../../components/hn/StoryCard.svelte";
  import Stories from "$lib/hn/Stories.svelte";
  import Story from "$lib/hn/Story.svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: kind = data.kind;

  const skeletonStories = Array(30).fill(0);

  const fetchStories = async (kind: string) => {
    const res = await fetch(`/api/hn/${kind}`);
    const stories = await res.json();
    return stories;
  };

  $: stories = createQuery({
    queryKey: ["hn", "stories", kind],
    queryFn: async () => {
      return await fetchStories(kind);
    },
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
  {#key data.kind}
    {#if $stories.isLoading}
      {#each skeletonStories as id}
        <Story {id} />
      {/each}
    {:else if $stories.isSuccess}
      <Stories storyKind={kind} initialStories={$stories.data.slice(0, 30)} />
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
