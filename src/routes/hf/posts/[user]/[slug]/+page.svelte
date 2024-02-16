<script lang="ts">
  import Comment from "$lib/components/hf/Comment.svelte";
  import Post from "$lib/components/hf/Post.svelte";
  import PostParser from "$lib/hf/PostParser";
  export let data;

    $: post = PostParser.safeParseSocialPost(data.post).data;


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
