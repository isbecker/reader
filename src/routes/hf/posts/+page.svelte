<script lang="ts">
  import Posts from "$lib/components/hf/Posts.svelte";
  import type { PageData } from "./$types";
  export let data;

  $: posts = data.posts;
</script>

<div>
  <Posts {posts} } />
</div>
