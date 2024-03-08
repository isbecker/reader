<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import type Readable from "../../../../../../types/Reabable";
  import type Post from "../../../../../../types/reddit/Post";

  export let data;
  const readable: Readable = data.readable;
  const post: Post = data.post;

  let summary = "";
  let summaryLoading = false;
  let mode: "full" | "summary" = "full";

  const summarize = async () => {
    if (summaryLoading) return;
    if (mode === "full") {
      mode = "summary";
      if (!summary) {
        summaryLoading = true;
        summary = await fetchSummary();
        summaryLoading = false;
      }
    } else {
      mode = "full";
    }
  };

  async function fetchSummary() {
    const response = await fetch(`/api/content/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: readable.textContent }),
    });
    const json = await response.json();

    return json.response;
  }
</script>

<div class="flex flex-col mx-auto place-items-center pt-2">
  <div class="flex flex-rowS gap-10 p-2">
    <div
      class="tooltip tooltip-accent tooltip-right"
      data-tip="Back to comments">
      <a class="btn btn-primary" href={post.permalink}>
        {post.num_comments ?? 0} Comments</a>
    </div>
    {#if summaryLoading}
      <div class="pointer-events-non btn disabled btn-accent">
        <span class="loading loading-infinity"></span>
      </div>
    {:else}
      <button class="btn btn-secondary" on:click={summarize}>
        {mode == "summary" ? "Full" : "Summarize"}
      </button>
    {/if}
    <article
      class="grow self-center text-base md:text-lg lg:text-3xl xl:text-5xl">
      <a class="link link-primary" href={post.url}>
        {post.title}
      </a>
      <p class="text-xs">({post.domain})</p>
    </article>
  </div>
  <div class="max-w-full p-2">
    {#if mode === "full" || (mode == "summary" && summaryLoading)}
      <article class="text-wrap prose">
        {@html readable.content}
      </article>
    {:else}
      <article class="text-wrap prose">
        <SvelteMarkdown source={summary} />
      </article>
    {/if}
  </div>
</div>
