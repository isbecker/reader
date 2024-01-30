<script lang="ts">
  import CommentCard from "../../../../../../components/reddit/CommentCard.svelte";
  export let data;
</script>

{#await data.post}
  <span class="loading loading-dots"></span>
{:then post}
  <div class="p-2 flex flex-col" id={post.id}>
    {#if post.title}
      <article class="prose mx-auto text-xl">
        <a class="link" href={post.url}>
          {post.title}
        </a>
      </article>

      <div class="tooltip" data-tip="Reader view">
        <a
          href={post.permalink.replace("comments", "readable")}
          class="btn btn-ghost">📜</a
        >
      </div>
    {/if}
    {#if post.post_hint == "image"}
      <div class="carousel mx-auto">
        <img
          class="carousel-item max-h-fit"
          src={post.url}
          alt="img"
        />
      </div>
    {/if}

    <div id="comments-section" class="flex flex-col max-w-max mx-auto">
      <ul class="divide-y divide-neutral mx-auto max-w-max">
        {#each post.comments as comment}
          <li class="">
            <CommentCard {comment} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/await}
