<script lang="ts">
  import type { SocialPost } from "$lib/hf/schemas/SocialPostSchema";
  import PostCard from "./PostCard.svelte";
  export let post: SocialPost;
</script>

<div>
  <PostCard {post} />
</div>
