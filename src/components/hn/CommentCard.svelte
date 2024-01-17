<script lang="ts">
  import type Comment from "../../types/hn/Comment";

  export let comment: Comment;
  let checked: boolean = true;
  export let nestLevel: number = 0;

  // Function to calculate the width based on nesting level
  function calculateWidth(level: number) {
    const baseSubtractAmount = 20; // Change this value as needed
    return `calc(100vw - ${level * baseSubtractAmount}px)`;
  }

  // Reactive statement to update the offset
  $: widthStyle = calculateWidth(nestLevel);
</script>

{#if comment && comment.author}
  <div
    class="collapse collapse-arrow divide-x divide-accent "
    id="comment-{comment.id}"
  >
    <input class="" type="checkbox" {checked} />
    <div class="collapse-title text-xs font-medium text-secondary">
      <div class="join gap-1">
        <a
          href="https://news.ycombinator.com/user?id={comment.author}"
          class="hover:underline text-sm z-10"
          >{comment.author}
        </a>
        <p class="text-sm text-base-content">
          at
          {new Date(comment.time * 1000).toLocaleString()}
        </p>
        {#if comment.isRoot}
          <div class="gap-1 z-10">
            <a
              class="text-sm text-secondary hover:underline"
              href="#comment-{comment.parent}">parent</a
            >

            <a
              class="text-sm text-secondary hover:underline"
              href="#comment-{comment.root}">root</a
            >
          </div>
        {/if}
      </div>
    </div>

    <div class="collapse-content" style={`width: ${widthStyle};`}>
      <article class="text-wrap prose sm:prose-sm md:prose-lg lg:prose-xl">
        {@html comment.text}
      </article>
      {#if comment.children}
        {#each comment.children as child}
          <div class="child-comment">
            <svelte:self comment={child} nestLevel={nestLevel + 1} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}
