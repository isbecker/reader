<script lang="ts">
  import CommentCard from "$lib/components/reddit/CommentCard.svelte";
  import he from "he";
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
          class="btn btn-ghost"><svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          class="fill-secondary"
          ><path
            d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
          /></svg
        ></a
        >
      </div>
    {/if}
    {#if post.content}
      <div class="prose mx-auto">
        {@html he.decode(post.content)}
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
