<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import { writable } from "svelte/store";
  import type Readable from "../../../../types/Reabable";
  import type Story from "../../../../types/hn/Story";

  export let data;

  let story: Story = data.story;
  let readable: Readable = data.readable;

  const mapResults = writable<{ [key: number]: string }>({});
  $: mapResultsArray = Object.entries($mapResults).map(
    ([chunkId, response]) => ({
      chunkId: Number(chunkId),
      response,
    }),
  );
  $: reduceResult = ""; // Reactive value for the streamed reduce result
  let showMapResults = true; // Flag to show the map results

  let summary = "";
  let summaryLoading = false;
  let mode: "full" | "summary" = "full";

  const summarize = async () => {
    if (summaryLoading) return;
    if (mode === "full") {
      mode = "summary";
      if (!summary) {
        summaryLoading = true;
        await fetchSummary();
        summaryLoading = false;
      }
    } else {
      mode = "full";
    }
  };

  // Function to append new data based on chunkId
  function appendMapResult(chunkId: number, response: string) {
    mapResults.update((currentResults) => {
      const updatedResults = { ...currentResults };
      if (updatedResults[chunkId]) {
        updatedResults[chunkId] += response; // Append new data to existing data
      } else {
        updatedResults[chunkId] = response; // Initialize with new data
      }
      return updatedResults;
    });
  }

  async function fetchSummary() {
    const response = await fetch("/api/content/summary/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: readable.textContent }),
    });

    if (response.ok) {
      const { sessionId } = await response.json();
      const eventSource = new EventSource(`/api/content/summary/${sessionId}`);
      eventSource.addEventListener("mappingStep", (event) => {
        const { response, chunkId } = JSON.parse(event.data);
        appendMapResult(chunkId, response);
      });
      eventSource.addEventListener("reduceStep", (event) => {
        // Switch to showing the reduce result when the first chunk arrives
        showMapResults = false;
        const { response } = JSON.parse(event.data);
        reduceResult += response; // Concatenate the new chunk to the existing result
      });
      eventSource.addEventListener("[DONE]", (event) => {
        summary = reduceResult;
        eventSource.close();
      });

      // Set up event listeners on eventSource as needed...
    } else {
      console.error("Failed to set up summary");
    }
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
      {#if showMapResults}
        <div class="grid grid-cols-2 gap-2">
          {#each mapResultsArray as { chunkId, response }}
            <div class="flex flex-row gap-2 max-w-prose">
              <span class="text-xs">{chunkId}</span>
              <article class="text-xs prose">
                <SvelteMarkdown source={response} />
              </article>
            </div>
          {/each}
        </div>
      {:else}
        <article class="text-wrap prose">
          <SvelteMarkdown source={reduceResult} />
        </article>
      {/if}
      <article class="text-wrap prose">
        <SvelteMarkdown source={summary} />
      </article>
    {/if}
  </div>
</div>
