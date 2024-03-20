<script lang="ts">
  import Posts from "$lib/components/hf/Posts.svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import type { PageData } from "./$types";

  export let data: PageData;

  // an array of 10 items, just dummy data to show a loading skeleton
  const skeletonPosts = Array(10).fill(null);

  const fetchPosts = async (skip: number) => {
    const res = await fetch(`/api/hf/posts?skip=${skip}`);
    return await res.json();
  };

  const posts = createQuery({
    queryKey: ["hf", "posts", data.skip],
    queryFn: async () => {
      return await fetchPosts(data.skip);
    },
  });
</script>

<svelte:head>
  <title>beckr.dev - HF Posts</title>
</svelte:head>

<div>
  {#if $posts.isLoading}
    <div class="flex flex-col justify-center gap-2">
      {#each skeletonPosts as _}
        <div class="container max-w-4xl mx-auto p-1">
          <div
            class="card card-bordered card-compact bg-base-100 shadow-xl h-48">
            <div class="card-body">
              <div class="card-title">
                <div class="w-4 h-4 rounded-full skeleton" />
                <!-- Avatar -->
                <div class="w-16 h-4 skeleton" />
                <!-- Author -->
                <div class="w-24 h-4 skeleton" />
                <!-- Date -->
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
  {:else if $posts.isSuccess}
    <Posts posts={$posts.data} />
  {:else if $posts.isError}
    <div>Error: {$posts.error.message}</div>
  {/if}
</div>
