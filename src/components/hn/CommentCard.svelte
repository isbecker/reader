<script lang="ts">
  import type Comment from "../../types/hn/Comment";

  export let comment: Comment;
  let checked: boolean = true;
</script>

{#if comment && comment.author}
  <div
    class="collapse collapse-arrow "
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

    <div class="collapse-content">
      <article class="text-wrap  prose ">
        {@html comment.text.replace(
          /<a/g,
          '<a class="hover:underline text-secondary"',
        )}
      </article>
      {#if comment.children}
        {#each comment.children as child}
            <svelte:self comment={child} />
        {/each}
      {/if}
    </div>
  </div>
{/if}
