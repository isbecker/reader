<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { writable, type Writable } from "svelte/store";
  import type Post from "../types/reddit/Post";

  export let post: Post;
  let is_read: boolean = false;
  let hide_read: boolean = false;
  let has_intersected: boolean = false;
  let card: HTMLDivElement;

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

  async function fetchReadableContent(post: Post): Promise<any> {
    let response = await fetch(`/api/content/readable?url=${post.url}`);
    if (response.ok) {
      let data = await response.json();
      return data.article ?? data.error;
    } else {
      throw new Error("Failed to fetch");
    }
  }
</script>

<div
  bind:this={card}
  class="card card-bordered flex flex-row"
  class:opacity-20={is_read}
  class:hidden={is_read && hide_read}
>
  <div class="flex flex-col p-2 gap-1 shrink-0">
    <figure class="">
      <img src={post.image} alt="img" />
    </figure>
    <button class="btn btn-accent btn-outline btn-sm">
      {post.comments?.length ?? 0} comments
    </button>
  </div>
  <div class="card-body flex flex-col">
    <div class="flex flex-col">
      <div class="card-title">
        {post.title}
      </div>
      <div class="">
        <SvelteMarkdown source={post.excerpt} />
      </div>
    </div>
  </div>
  <div class="card-actions place-self-end p-2">
    <button
      class="btn btn-accent btn-xs"
      on:click={() => {
        fetchReadableContent(post).then((article) => {
          post.content = article.content;
          post.excerpt = article.excerpt;
          post.readable = article.textcontent;
          console.log(`${JSON.stringify(article)}`);
          post.is_read = true;
        });
      }}>More</button
    >
  </div>
</div>
