<script lang="ts">
  import type { Comment } from "$lib/hf/schemas/CommentSchemas";
  import moment from "moment";

  export let comment: Comment;

  let checked: boolean = comment.author;
</script>

<div class="mx-auto max-w-4xl" id={comment.id}>
  <div class="collapse collapse-plus divide-x divide-accent">
    <input class="" type="checkbox" {checked} />

    <div class="collapse-title">
      <article class="join gap-1">
        {#if comment.author}
          <div class="z-10">
            <a class="text-xs link link-primary" href="https://hf.co/{comment.author?.name}">
              <div class="avatar">
                <div class="w-4 rounded-full">
                  <img src={comment.author?.avatarUrl} alt={comment.author?.name} />
                </div>
              </div>
              <span>{comment.author?.name}</span>
            </a>
          </div>
        {:else}
          <p class="text-xs">deleted</p>
        {/if}
        <a class="text-xs link link-secondary self-center z-10" href="#{comment.id}">
          {moment(comment.createdAt).fromNow()}
        </a>
      </article>
    </div>

    <div class="collapse-content">
      <article class="prose">
        {@html comment.data.latest.html}
      </article>
      {#each comment.replies ?? [] as reply}
        <svelte:self comment={reply} />
      {/each}
    </div>
  </div>
</div>
