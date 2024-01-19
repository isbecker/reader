<script lang="ts">
  import type Readable from "../../../../types/Reabable";
  import type Story from "../../../../types/hn/Story";

  export let data;

  let story: Story = data.story;
  let readable: Readable = data.readable;
</script>

<div class="flex flex-col mx-auto place-items-center pt-2">
  <div class="flex flex-row join gap-10">
    <div class="tooltip tooltip-bottom" data-tip="Back to HN">
      <a class="btn btn-primary" href="/hn/item/{story.id}"
        >{story.descendants ?? 0} Comments</a
      >
    </div>
    <article
      class="grow self-center text-base md:text-lg lg:text-3xl xl:text-5xl"
    >
      <a class="link link-primary" href={story.url}>
        {story.title}
      </a>
      <p class="text-xs">({story.domain})</p>
    </article>
  </div>
  <div class="max-w-full p-2">
    <article class="prose text-wrap">
      {@html readable.content}
    </article>
  </div>
</div>
