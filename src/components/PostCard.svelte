<script lang="ts">
  import he from "he";
  import { onDestroy, onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type Post from "../types/reddit/Post";

  export let post: Post;
  let is_read: boolean = false;
  let hide_read: boolean = false;
  let has_intersected: boolean = false;
  let card: HTMLAnchorElement;

  const observer: Writable<IntersectionObserver | null> = writable(null);
  onMount(() => {
    is_read = post.is_read;
    observer.set(
      new IntersectionObserver(([entry]) => {
        if (
          entry.intersectionRatio <= 0 &&
          has_intersected &&
          entry.boundingClientRect.y < (entry.rootBounds?.y ?? 0)
        ) {
          // is_read = true;
        } else {
          has_intersected = true;
        }
      }),
    );

    observer.subscribe((obs) => {
      obs?.observe(card);
    });
  });

  onDestroy(() => {
    observer.subscribe((obs) => {
      obs?.unobserve(card);
    });
  });

  // async function fetchReadableContent(): Promise<Partial<Readable>> {
  //   if (post.post_hint === "image") {
  //     return {
  //       error: "Image posts are not supported",
  //     };
  //   }

  //   let response = await fetch(`/api/content/readable?url=${post.url}`);
  //   if (response.ok) {
  //     let data = await response.json();
  //     const readable = parseReadable(data);

  //     post.readable = readable;
  //     return readable;
  //   } else {
  //     // TODO: Perhaps add a help doc link to a list of sites that don't work nicely
  //     throw new Error(
  //       "Failed to fetch readable content. Some sites are uncooperative.",
  //     );
  //   }
  // }
</script>

<div class="hover:bg-base-200">
  <a
    class="card card-bordered card-compact"
    class:opacity-20={is_read}
    class:hidden={is_read && hide_read}
    href={post.url}
    bind:this={card}
  >
    <!-- <div class="place-self-center  p-2 gap-1 shrink-0">
      {#if post.image && post.image != "self" && post.image !== "spoiler" && post.image !== "default"}
        <figure class="">
          <img src={post.image} alt="img" />
        </figure>
      {/if}
    </div> -->
    <div class="card-body">
      <!-- <div class="join gap-1"> -->
        <!-- {#if post.image && post.image != "self" && post.image !== "spoiler" && post.image !== "default" && post.post_hint !== "image" && post.post_hint !== "rich:video"}
          <figure class="">
            <img src={post.image} alt="img" />
          </figure>
        {/if} -->
        <div class="card-title hover:link">
          <p class="text-xs md:text-base lg:text-lg xl:text-xl">
            {he.decode(post.title)}
          </p>
        </div>
      <!-- </div> -->

      <div class="join gap-1">
        <p class="text-xs text-info">({post.domain})</p>
        <p class="text-xs text-accent">{post.ups} points</p>
        <p class="text-xs text-warning">r/{post.subreddit}</p>
      </div>

      <div class="card-actions justify-end">
        <div class="tooltip tooltip-left w-fit shrink" data-tip="Reader view">
          <a
            href={post.permalink.replace("comments", "readable")}
            class="btn btn-ghost btn-xs md:btn-sm sm:btn-xs lg:btn-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              class="fill-secondary"
              ><path
                d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
              /></svg
            >
          </a>
        </div>
        <a
          class="btn btn-xs btn-primary md:btn-sm sm:btn-xs lg:btn-md"
          href={post.permalink}
        >
          {post.num_comments ?? 0} Comments
        </a>
      </div>

      {#if post.post_hint == "image"}
        <div>
          <img src={post.url} alt="img" style="max-height: 600px;" />
        </div>
      {:else if post.post_hint == "rich:video"}
        <div class="text-secondary">
          {post.url}
        </div>
      {/if}
    </div>
  </a>
</div>
