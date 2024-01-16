<script lang="ts">
  import type Story from "../../types/hn/Story";

  export let story: Story;
</script>

<div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="card card-bordered hover:bg-base-200">
    <div class="card-body">
      <a class="card-title flex-col place-items-start" href={story.url}>
        <p>{story.title}</p>
        <div class="join gap-1">
          <p class="text-xs">{story.score} points</p>
          <p class="text-xs">by {story.author}</p>
          <p class="text-xs">
            at {new Date(story.time * 1000).toLocaleString()}
          </p>
        </div>
      </a>
      <div class="card-actions justify-end">
        <a class="btn btn-primary" href="/hn/item/{story.id}">
          {story.descendants ?? 0} Comments
        </a>
      </div>
    </div>
  </div>
</div>
