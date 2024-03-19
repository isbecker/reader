<script lang="ts">
  import Posts from "$lib/components/hf/Posts.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  // an array of 10 items, just dummy data to show a loading skeleton
  const skeletonPosts = Array(10).fill(null);
</script>

<svelte:head>
  <title>beckr.dev - HF Posts</title>
</svelte:head>

<div>
  {#await data.posts}
    <div class="flex flex-col justify-center gap-2">
      {#each skeletonPosts as _}
        <div class="container max-w-4xl mx-auto p-1">
          <div
            class="card card-bordered card-compact bg-base-100 shadow-xl h-48">
            <div class="card-body">
              <div class="card-title">
                <div class="w-4 h-4 rounded-full skeleton" /> <!-- Avatar -->
                <div class="w-16 h-4 skeleton" /> <!-- Author -->
                <div class="w-24 h-4 skeleton" /> <!-- Date -->
              </div>
              <!-- Text of the post -->
              <div class="flex flex-col gap-4">
                <div class="w-full max-w-prose h-4 skeleton" />
                <div class="w-full max-w-prose h-4 skeleton" />
                <div class="w-full max-w-prose h-4 skeleton" />
                <div class="w-full max-w-prose h-4 skeleton" />
              </div>
              <div>
                <div class="pb-4 absolute right-4">
                  <!-- ...read more -->
                  <div class="skeleton w-24 h-4"></div>
                </div>
                <div>
                  <!-- Reactions -->
                  <div class="flex flex-row gap-4">
                    <div class="w-8 h-4 badge skeleton" />
                    <div class="w-8 h-4 badge skeleton" />
                    <div class="w-8 h-4 badge skeleton" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:then posts}
    <Posts {posts} />
  {/await}
</div>
