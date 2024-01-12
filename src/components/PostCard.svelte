<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type Readable from "../types/Reabable";
  import { parseReadable } from "../types/Reabable";
  import type Post from "../types/reddit/Post";

  export let post: Post;
  let is_read: boolean = false;
  let hide_read: boolean = false;
  let has_intersected: boolean = false;
  let card: HTMLDivElement;

  let readableContent = fetchReadableContent();

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
          is_read = true;
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

  async function fetchReadableContent(): Promise<Partial<Readable>> {
    if (post.post_hint === "image") {
      return {
        error: "Image posts are not supported",
      };
    }

    let response = await fetch(`/api/content/readable?url=${post.url}`);
    if (response.ok) {
      let data = await response.json();
      const readable = parseReadable(data);

      post.readable = readable;
      return readable;
    } else {
      // TODO: Perhaps add a help doc link to a list of sites that don't work nicely
      throw new Error(
        "Failed to fetch readable content. Some sites are uncooperative.",
      );
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={card}
  class="card card-bordered flex flex-row"
  class:opacity-20={is_read}
  class:hidden={is_read && hide_read}
  on:click={() => {
    const newWindow = window.open(post.url, "_blank");
    if (newWindow) {
      newWindow.focus();
    }
    is_read = true;
  }}
>
  <div class="place-self-center flex flex-col p-2 gap-1 shrink-0">
    {#if post.image != "self" && post.image}
      <figure class="">
        <img src={post.image} alt="img" />
      </figure>
    {/if}
    <button
      class="btn btn-accent btn-outline btn-sm"
      on:click={() => {
        const newWindow = window.open(
          `https://old.reddit.com/${post.permalink}`,
          "_blank",
        );
        if (newWindow) {
          newWindow.focus();
        }
      }}
    >
      {post.num_comments} comments
    </button>
  </div>
  <div class="card-body flex flex-col">
    <div class="flex flex-col">
      <div class="card-title flex flex-col place-items-start">
        <p class="text-2xl">{post.title}</p>
        <p class="text-xs">{post.domain}</p>
      </div>
      <div class="divider"></div>

      {#if post.post_hint == "image"}
        <div>
          <img src={post.url} alt="img" style="max-height: 600px;" />
        </div>
      {:else if post.post_hint == "rich:video"}
        <div class="text-secondary">
          {post.url}
        </div>
      {:else}
        {#await readableContent}
          <p>loading...</p>
        {:then readable}
          {#if readable.error}
            <div class="text-red-500">{readable.error}</div>
          {:else}
            <div
              class="collapse collapse-arrow border"
              on:click={(event) => event.stopPropagation()}
            >
              <input type="checkbox" />
              <div class="collapse-title">{readable.excerpt}</div>
              <div class="collapse-content">
                <p>
                  {readable.textContent}
                </p>
              </div>
            </div>
          {/if}
        {:catch error}
          <div class="text-red-500">{error.message}</div>
        {/await}
      {/if}
    </div>
  </div>
</div>
