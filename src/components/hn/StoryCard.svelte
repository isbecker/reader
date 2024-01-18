<script lang="ts">
  import moment from "moment";
  import type Story from "../../types/hn/Story";

  export let story: Story;
</script>

<div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="card card-bordered hover:bg-base-200">
    <div class="card-body">
      <a class="card-title flex-col place-items-start" href={story.url}>
            <p class="text-xs">
              {moment.unix(story.time).fromNow()}
            </p>
      </a>
      <div class="card-actions justify-end">
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
