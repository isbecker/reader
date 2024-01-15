<script lang="ts">
  import type Comment from "../../types/hn/Comment";

  export let comment: Comment;
</script>

{#if comment && comment.author}
  <div
    class="collapse collapse-arrow border border-primary"
    id="comment-{comment.id}"
  >
    <input type="checkbox" checked />
    <div class="collapse-title text-xs font-medium text-secondary">...</div>

    <div class="collapse-content">
      <div class="join gap-1">
        <a
          href="https://news.ycombinator.com/user?id={comment.author}"
          class="hover:underline text-sm">{comment.author}</a
        >
        <p class="text-sm text-base-content">
          at
          {new Date(comment.time * 1000).toLocaleString()}
        </p>
        <div class="divider divider-horizontal"></div>
        <a href="#comment-{comment.parent}" class="text-sm hover:underline"
          >parent</a
        >
      </div>
      <div class="divider"></div>
      <p>{@html comment.text}</p>
      {#if comment.children}
        <div class="collapse collapse-arrow border border-primary">
          <input type="checkbox" checked />
          <div class="collapse-title text-xs font-medium text-secondary">
            ...
          </div>
          <div class="collapse-content">
            {#each comment.children as child}
              <svelte:self comment={child} />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
