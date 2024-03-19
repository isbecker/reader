<script lang="ts">
  import Comment from "$lib/components/hf/Comment.svelte";
  import Post from "$lib/components/hf/Post.svelte";
  export let data;

  let skeletonComments = Array(3).fill(0);
</script>

<svelte:head>
  {#await data.post}
    <title>beckr.dev - HF Post</title>
  {:then post}
    <title>{post.rawContent.slice(0, 64)}... - beckr.dev - @{post.author?.name} on HF</title>
    <meta name="description" content={post.rawContent} />
    <meta property="og:title" content={post.rawContent} />
    <meta property="og:description" content={post.rawContent} />
    <meta property="og:image" content={post.author?.avatarUrl} />
  {/await}
</svelte:head>

<div>
  {#await data.post}
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
  {:then post}
    <Post {post} />
    <div id="comments">
      {#each post.comments ?? [] as comment}
        <div>
          <Comment {comment} />
        </div>
      {/each}
    </div>
  {/await}
</div>
