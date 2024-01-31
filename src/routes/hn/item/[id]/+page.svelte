<script lang="ts">
  import moment from "moment";
  import CommentCard from "../../../../components/hn/CommentCard.svelte";
  export let data;
  const story = data.story;
</script>

<div class="">
  <div class="card">
    <div class="card-body">
      <a class="card-title flex-col place-items-start mx-auto" href={story.url}>
        <article class="join gap-1">
          <div class="text-base md:text-lg lg:text-3xl xl:text-5xl">
            {story.title}
          </div>
          {#if story.domain}
            <div class="text-sm self-center">({story.domain})</div>
          {/if}
        </article>
        <div class="tooltip place-self-start" data-tip="Reader view">
          <a
            href="/hn/readable/{story.id}"
            class="link link-primary btn btn-ghost max-w-fit"><svg
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
        <div class="join gap-1">
          <div class="text-sm">{story.score} points</div>
          <a
            class="text-sm hover:underline"
            href="https://news.ycombinator.com/user?id={story.author}"
            >{story.author}</a
          >
          <p class="text-sm">
            {moment.unix(story.time).fromNow()}
          </p>
        </div>
      </a>
      <div class="mx-auto max-w-prose w-full">
        {#if story.text}
          <article class="text-wrap prose">{@html story.text}</article>
        {/if}
      </div>
    </div>
  </div>
  <div class="">
    {#await story.comments}
      <span class="loading loading-dots loading-lg"></span>
    {:then loaded}
      <ul class="divide-y divide-neutral mx-auto max-w-max">
        {#if loaded}
          {#each loaded as comment}
            <li class="">
              <div class="">
                <CommentCard {comment} />
              </div>
            </li>
          {/each}
        {/if}
      </ul>
    {/await}
  </div>
</div>
