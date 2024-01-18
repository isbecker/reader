<script lang="ts">
  import moment from "moment";
  import CommentCard from "../../../../components/hn/CommentCard.svelte";
  export let data;
  const story = data.story;
</script>

<div class="">
  <div class="card">
    <div class="card-body">
      <a class="card-title flex-col place-items-start" href={story.url}>
        <div class="join gap-1">
          <div class="text-base md:text-lg lg:text-3xl xl:text-5xl">
            {story.title}
          </div>
          <div class="text-sm self-center">({story.domain})</div>
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
      <div class="">
        {#if story.text}
          <div>{@html story.text}</div>
        {/if}
      </div>
    </div>
  </div>
  <div class="">
    {#await story.comments}
      <span class="loading loading-dots loading-lg"></span>
    {:then loaded}
      <ul class="divide-y divide-neutral mx-auto max-w-max ">
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
