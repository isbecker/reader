<script lang="ts">
  import moment from "moment";
  import type Comment from "../../types/hn/Comment";

  export let comment: Comment;
  let checked: boolean = true;
  export let nestLevel: number = 0;

  // Function to calculate the width based on nesting level
  function calculateWidth(level: number) {
    const baseSubtractAmount = 16; // Change this value as needed
    return `calc(100vw - ${level * baseSubtractAmount}px)`;
  }

  // Reactive statement to update the offset
  $: widthStyle = calculateWidth(nestLevel);
</script>

{#if comment && comment.author}
  <div
    class="collapse collapse-plus divide-x divide-accent"
    id="comment-{comment.id}"
    style={`max-width: ${widthStyle};`}
  >
    <input class="" type="checkbox" {checked} />
    <article class="collapse-title text-xs font-medium">
      <div class="join gap-1">
        <a
          href="https://news.ycombinator.com/user?id={comment.author}"
          class="text-sm z-10 text-secondary link btn btn-ghost btn-xs"
          >{comment.author}
        </a>
        <a
          href="#comment-{comment.id}"
          class="text-sm z-10 link btn btn-ghost btn-xs"
        >
          {moment.unix(comment.time).fromNow()}
        </a>
      </div>
    </article>

    <div class="collapse-content" style={`max-width: ${widthStyle};`}>
      <article class="text-wrap prose">
        {@html comment.text}
      </article>
      {#if !comment.isRoot}
          <div class="join gap-1">
            <a
              class="btn btn-ghost btn-xs link link-secondary"
              href="#comment-{comment.parent}">parent</a
            >

            <a
              class="btn btn-ghost btn-xs link link-secondary"
              href="#comment-{comment.root}">root</a
            >
          </div>
        {/if}
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
