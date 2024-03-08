<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import type Readable from "../../../../types/Reabable";
  import type Story from "../../../../types/hn/Story";

  export let data;

  let story: Story = data.story;
  let readable: Readable = data.readable;

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

<div class="mx-auto flex flex-col place-items-center pt-2">
  <div class="join flex flex-row gap-10">
    <div class="tooltip tooltip-bottom" data-tip="Back to HN">
      <a class="btn btn-primary" href="/hn/item/{story.id}"
        >{story.descendants ?? 0} Comments</a>
    </div>
    <div>
      {#if summaryLoading}
        <div class="pointer-events-non btn disabled btn-accent">
          <span class="loading loading-infinity"></span>
        </div>
      {:else}
        <button class="btn btn-secondary" on:click={summarize}>
          {mode == "summary" ? "Full" : "Summarize"}
        </button>
      {/if}
    </div>
    <article
      class="grow self-center text-base md:text-lg lg:text-3xl xl:text-5xl">
      <a class="link link-primary" href={story.url}>
        {story.title}
      </a>
      <p class="text-xs">({story.domain})</p>
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
