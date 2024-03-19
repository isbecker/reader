<script lang="ts">
  import Comment from "$lib/components/hf/Comment.svelte";
  import Post from "$lib/components/hf/Post.svelte";
  export let data;

  $: post = data.post;
</script>

<svelte:head>
  <title>{post.rawContent.slice(0, 64)}... - beckr.dev - @{post.author?.name} on HF</title>
  <meta name="description" content={post.rawContent} />
  <meta property="og:title" content={post.rawContent} />
  <meta property="og:description" content={post.rawContent} />
  <meta property="og:image" content={post.author?.avatarUrl} />
</svelte:head>

<div>
  <Post {post} />
  <div id="comments">
    {#each post.comments ?? [] as comment}
      <div>
        <Comment {comment} />
      </div>
    {/each}
  </div>
</div>
