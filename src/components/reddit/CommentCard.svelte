<script lang="ts">
  import he from "he";
  import type Comment from "../../types/reddit/Comment";

  export let comment: Comment;
  export let nestLevel: number = 0;

  let checked: boolean = true;
  let decodedBody: string = "";

  // Function to calculate the width based on nesting level
  function calculateWidth(level: number) {
    const baseSubtractAmount = 16; // Change this value as needed
    return `calc(100vw - ${level * baseSubtractAmount}px)`;
  }

  // Reactive statement to update the offset
  $: widthStyle = calculateWidth(nestLevel);
  $: {
    try {
      if (comment.body_html) {
        decodedBody = he.decode(comment.body_html);
      }
    } catch (e) {
      decodedBody = comment.body;
    }
  }
</script>

{#if comment && comment.kind !== "more"}
  <div
    class="collapse collapse-arrow divide-x divide-accent"
    id={comment.id}
    style={`max-width: ${widthStyle};`}
  >
    <input class="" type="checkbox" checked />
    <article class="collapse-title text-xs font-medium">
      <div class="join gap-1">
        <p>{comment.ups} points</p>
        <a
          class="btn btn-ghost btn-sm link z-10"
          href="https://old.reddit.com/user/{comment.author}"
        >
          {comment.author}
        </a>
        <a
          class="btn btn-ghost btn-sm link link-primary z-10"
          href="#{comment.parent.id}">parent</a
        >
        {#if !comment.isRoot}
          <a
            class="btn btn-ghost btn-sm link link-primary z-10"
            href="#{comment.root?.id}">root</a
          >
        {/if}
      </div>
    </article>
    <div class="collapse-content" style={`max-width: ${widthStyle};`}>
      <article class="prose text-wrap">
        {@html decodedBody}
      </article>
      {#if comment.replies}
        {#each comment.replies as reply}
          <svelte:self comment={reply} nestLevel={nestLevel + 1} />
        {/each}
      {/if}
    </div>
  </div>
{/if}
