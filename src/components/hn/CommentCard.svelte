<script lang="ts">
  import type Comment from "../../types/hn/Comment";

  export let comment: Comment;
  let checked: boolean = true;
</script>

{#if comment && comment.author}
  <div
    class="collapse collapse-arrow border border-primary"
    id="comment-{comment.id}"
  >
    <input type="checkbox" {checked} />
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
          <div class="divider divider-horizontal"></div>
          <a
            class="text-sm text-secondary z-10 hover:underline"
            href="#comment-{comment.parent}">parent</a
          >
          <div class="divider divider-horizontal"></div>
          <a
            class="text-sm text-secondary z-10 hover:underline"
            href="#comment-{comment.root}">root</a
          >
        {/if}
      </div>
    </div>

    <div class="collapse-content">
      <p>
        {@html comment.text.replace(/<a/g, '<a class="hover:underline text-secondary"')}
      </p>
      {#if comment.children}
        {#each comment.children as child}
          <svelte:self comment={child} />
        {/each}
      {/if}
    </div>
  </div>
{/if}
