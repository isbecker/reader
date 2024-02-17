<script lang="ts">
  import Comment from "$lib/components/hf/Comment.svelte";
  import Post from "$lib/components/hf/Post.svelte";
  export let data;

  $: post = data.post;
</script>

<div>
  <Post {post} />
  <div>
    {#each post.comments ?? [] as comment}
      <div>
        <Comment {comment} />
      </div>
    {/each}
  </div>
</div>
