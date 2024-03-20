<script lang="ts">
  import Comment from "$lib/components/hf/Comment.svelte";
  import Post from "$lib/components/hf/Post.svelte";
  import type { SocialPost } from "$lib/types/hf/schemas/SocialPostSchema";
  import { createQuery } from "@tanstack/svelte-query";

  export let data;

  let skeletonComments = Array(3).fill(0);

  const fetchPost = async (user: string, slug: string) => {
    const res = await fetch(`/api/hf/posts/${user}/${slug}`);
    const postJson = await res.json();
    return postJson as SocialPost;
  };

  const post = createQuery({
    queryKey: ["hf", "post", data.user, data.slug],
    queryFn: async () => {
      return await fetchPost(data.user, data.slug);
    },
  });
</script>

<svelte:head>
  {#if $post.isLoading}
    <title>beckr.dev - HF Post</title>
  {:else if $post.isSuccess}
    <title
      >{$post.data.rawContent.slice(0, 64)}... - beckr.dev - @{$post.data.author
        ?.name} on HF</title>
    <meta name="description" content={$post.data.rawContent} />
    <meta property="og:title" content={$post.data.rawContent} />
    <meta property="og:description" content={$post.data.rawContent} />
    <meta property="og:image" content={$post.data.author?.avatarUrl} />
  {/if}
</svelte:head>

<div>
  {#if $post.isLoading}
    <div class="container max-w-4xl mx-auto p-1">
      <div class="card card-bordered card-compact bg-base-100 shadow-xl">
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
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
            <div class="w-full max-w-prose h-4 skeleton" />
          </div>
          <div>
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
    {#each skeletonComments as _}
      <!-- Comments -->
      <div class="container max-w-4xl mx-auto">
        <div class="card card-bordered card-compact bg-base-100">
          <div class="card-body">
            <div class="card-title">
              <div class="w-4 h-4 rounded-full skeleton" />
              <!-- Avatar -->
              <div class="w-16 h-4 skeleton" />
              <!-- Author -->
              <div class="w-24 h-4 skeleton" />
              <!-- Date -->
            </div>
            <!-- Text of the comment -->
            <div class="flex flex-col gap-4">
              <div class="w-full max-w-prose h-4 skeleton" />
              <div class="w-full max-w-prose h-4 skeleton" />
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
    {/each}
  {:else if $post.isSuccess}
    <Post post={$post.data} />
    <div id="comments">
      {#each $post.data.comments ?? [] as comment}
        <div>
          <Comment {comment} />
        </div>
      {/each}
    </div>
  {/if}
</div>
