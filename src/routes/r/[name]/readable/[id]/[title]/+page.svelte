<script lang="ts">
  import type Readable from "../../../../../../types/Reabable";
  import type Post from "../../../../../../types/reddit/Post";

  export let data;
  const readable: Readable = data.readable;
  const post: Post = data.post;
</script>

<div class="flex flex-col mx-auto place-items-center pt-2">
  <div class="flex flex-row join gap-10">
    <div class="tooltip tooltip-bottom" data-tip="Back to comments">
      <a class="btn btn-primary" href={post.permalink}>
        {post.num_comments ?? 0} Comments</a
      >
    </div>
    <article
      class="grow self-center text-base md:text-lg lg:text-3xl xl:text-5xl"
    >
      <a class="link link-primary" href={post.url}>
        {post.title}
      </a>
      <p class="text-xs">({post.domain})</p>
    </article>
  </div>
  <div class="max-w-full p-2">
    <article class="prose text-wrap">
      {@html readable.content}
    </article>
  </div>
</div>
