<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type Post from "../types/reddit/Post";

  export let post: Post;
  let is_read: boolean = false;
  let hide_read: boolean = false;
  let has_intersected: boolean = false;
  let card: HTMLAnchorElement;

  // let readableContent: Promise<Partial<Readable>>;

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

<a
  class="card card-bordered card-compact flex flex-row"
  class:opacity-20={is_read}
  class:hidden={is_read && hide_read}
  href={post.url}
  bind:this={card}
>
  <div class="place-self-center flex flex-col p-2 gap-1 shrink-0">
    {#if post.image && post.image != "self" && post.image !== "spoiler" && post.image !== "default"}
      <figure class="">
        <img src={post.image} alt="img" />
      </figure>
    {/if}
  </div>
  <div class="card-body flex flex-col hover:link">
    <div class="flex flex-col">
      <div class="card-title flex flex-col place-items-start">
        <p class="">{post.title}</p>
        <p class="text-xs">({post.domain})</p>
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
    <div class="card-actions justify-end">
      <div class="tooltip place-self-start" data-tip="Reader view">
        <a
          href={post.permalink.replace("comments", "readable")}
          class="btn btn-ghost max-w-fit">📜</a
        >
      </div>
      <a class="btn btn-primary" href={post.permalink}>
        {post.num_comments ?? 0} Comments
      </a>
    </div>
  </div>
</a>
