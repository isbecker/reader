<script lang="ts">
  import moment from "moment";
  import type Story from "../../types/hn/Story";

  export let story: Story;
</script>

<div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="card card-bordered card-compact hover:bg-base-200">
    <div class="card-body">
      <a class="card-title flex-col place-items-start" href={story.url}>
        <article>
          <p>{story.title}</p>
          <div class="join gap-1">
            <p class="text-xs">{story.score} points</p>
            <div class="join gap-1">
              <p class="text-xs">by</p>
              <a
                class="text-xs hover:underline"
                href="https://news.ycombinator.com/user?id={story.author}"
                >{story.author}</a
              >
            </div>
            <p class="text-xs">
              {moment.unix(story.time).fromNow()}
            </p>
          </div>
        </article>
      </a>
      <div class="card-actions justify-end">
        <div class="tooltip place-self-start" data-tip="Reader view">
          <a
            data-sveltekit-preload-data
            href="/hn/readable/{story.id}"
            class="btn btn-ghost max-w-fit">📜</a
          >
        </div>
        <a
          class="btn btn-primary"
          href="/hn/item/{story.id}"
          data-sveltekit-preload-data
        >
          {story.descendants ?? 0} Comments
        </a>
      </div>
    </div>
  </div>
</div>
