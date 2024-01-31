<script lang="ts">
  import moment from "moment";
  import type Story from "../../types/hn/Story";

  export let story: Story;
</script>

<div class="hover:bg-base-200">
  <a class="card card-bordered card-compact" href={story.url}>
    <div class="card-body">
      <!-- Card title -->
      <div class="card-title">
        <div
          class="flex flex-col sm:flex-row gap-1 place-items-center hover:link"
        >
          <div class="flex flex-row gap-1 place-items-center">
            <p class="text-xs md:text-base lg:text-lg xl:text-x">
              {story.title}
            </p>
            <p class="text-[0.5rem] md:text-xs">({story.domain})</p>
          </div>
          <div class="flex flex-row gap-1 place-items-center">
            <p class="text-xs text-accent">{story.score} points</p>
            <p class="text-xs">by</p>
            <a
              class="text-xs link link-secondary"
              href="https://news.ycombinator.com/user?id={story.author}"
              >{story.author}</a
            >
            <p class="text-xs">
              {moment.unix(story.time).fromNow()}
            </p>

        <div class="tooltip tooltip-left" data-tip="Reader view">
          <a
            href="/hn/readable/{story.id}"
            class="btn btn-ghost btn-xs max-w-fit md:btn-sm sm:btn-xs lg:btn-md"
            ><svg
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
          </div>
        </div>
      </div>

      <!-- Card actions -->
      <div class="card-actions justify-end">
        <a
          class="btn btn-xs btn-primary md:btn-sm sm:btn-xs lg:btn-md "
          href="/hn/item/{story.id}"
        >
          {story.descendants ?? 0} Comments
        </a>
      </div>
    </div>
  </a>
</div>
