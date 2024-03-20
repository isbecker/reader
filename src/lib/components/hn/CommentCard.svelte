<script lang="ts">
  import { Comment } from "$lib/types/hn/item";
  import { createQuery } from "@tanstack/svelte-query";
  import he from "he";
  import moment from "moment";

  // import type Comment from "../../types/hn/Comment";
  // import { parseComment } from "../../types/hn/Comment";

  export let comment: Comment | undefined = undefined;
  export let id: number | undefined = undefined;
  export let nestLevel: number = 0;
  export let root: number | undefined = undefined;

  // const queryClient = useQueryClient();

  // let commentStore = writable(comment);
  const commentStore = createQuery({
    queryKey: ["hn", "item", comment?.id ?? id],
    queryFn: fetchComment,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    initialData: comment || Comment.createEmpty(id),
  });

  // let commentPromise: Promise<Comment> = comment
  //   ? Promise.resolve(comment)
  //   : fetchComment();
  let checked: boolean = true;

  // Function to calculate the width based on nesting level
  function calculateWidth(level: number) {
    const baseSubtractAmount = 16; // Change this value as needed
    return `calc(100vw - ${level * baseSubtractAmount}px)`;
  }

  // onMount(async () => {
  //   if (browser) {
  //     await fetchComment();
  //   }
  // });

  async function fetchComment(): Promise<Comment> {
    const res = await fetch(`/api/hn/item/${comment?.id ?? id}`);
    const commentJson = await res.json();
    const freshComment = commentJson as Comment;
    freshComment.root = root;
    freshComment.isRoot = nestLevel === 0;

    // commentStore.set(freshComment);

    return freshComment;
  }

  // Reactive statement to update the offset
  $: widthStyle = calculateWidth(nestLevel);
</script>

<!-- {#await commentPromise then comment} -->
{#if $commentStore.isLoading}
  <div>Loading</div>
{:else if $commentStore.isError}
  <div>Error: {$commentStore.error.message}</div>
{:else if $commentStore.isSuccess}
  <!-- <h1>
    {queryClient.getQueryData(["hn", "item", comment?.id ?? id])
      ? "Cached"
      : "New"}
  </h1> -->
  <!-- {#if $commentStore && $commentStore.author} -->
  <div
    class="collapse collapse-plus divide-x divide-accent"
    id="comment-{$commentStore.data.id}"
    style={`max-width: ${widthStyle};`}>
    <input class="" type="checkbox" {checked} />
    <article class="collapse-title text-xs font-medium">
      <div class="join gap-1">
        <a
          href="{$commentStore.data.deleted ? "" : `https://news.ycombinator.com/user?id=${$commentStore.data.author}`}"
          class="text-sm z-10 link link-secondary max-w-[10ch] truncate"
          >{$commentStore.data.deleted ? "deleted" : $commentStore.data.author}
        </a>
        <a
          href="#comment-{$commentStore.data.id}"
          class="text-sm z-10 link link-accent max-w-[15ch] truncate">
          {moment.unix($commentStore.data.time ?? 0).fromNow()}
        </a>
      </div>
    </article>

    <div class="collapse-content" style={`max-width: ${widthStyle};`}>
      <article class="text-wrap prose">
        {@html he.decode($commentStore.data.text ?? "")}
      </article>
      {#if nestLevel > 0}
        <div class="join gap-1">
          <a
            class="btn btn-ghost btn-xs link link-secondary"
            href="#comment-{$commentStore.data.parent}">parent</a>

          <a
            class="btn btn-ghost btn-xs link link-secondary"
            href="#comment-{$commentStore.data.root}">root</a>
        </div>
      {/if}
      {#if $commentStore.data.comments}
        {#each $commentStore.data.comments as child}
          <div class="child-comment">
            <svelte:self
              comment={child}
              nestLevel={nestLevel + 1}
              root={$commentStore.data.root ?? $commentStore.data.id} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}
<!-- {/await} -->
<!-- {#await commentPromise}
  <div class="flex flex-col gap-4 p-4 mx-auto max-w-prose" id="comment-{id}">
    <div class="join gap-1">
      <div class="skeleton h-4 w-64"></div>
      <div class="skeleton h-4 w-32"></div>
    </div>
    <div class="skeleton h-4" ></div>
  </div>
{:then comment}
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
        {#if comment.kids}
          {#each comment.kids as kid}
            <div class="child-comment">
              <svelte:self
                id={kid}
                nestLevel={nestLevel + 1}
                root={comment.root ?? comment.id}
              />
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
{/await} -->
