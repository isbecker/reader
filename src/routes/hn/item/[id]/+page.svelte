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
        <div class="join gap-1  ">
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
      <div class="mx-auto max-w-max">
        {#if story.text}
          <article class="prose">{@html story.text}</article>
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
