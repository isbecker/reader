<script lang="ts">
  import type Comment from "../../../../../types/reddit/Comment";
  export let data;
  let originalPost: Comment = data.op;
  let comments: Comment[] = data.comments;
</script>

<div>{originalPost.permalink}</div>

<div>
  {#if originalPost.body}
    <article class="prose">
      {@html originalPost.body}
    </article>
  {/if}

  <ul>
    {#each comments as comment}
      <li>
        <article class="prose">
          {@html comment.body}
        </article>
      </li>
    {/each}
  </ul>
</div>
