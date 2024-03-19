<script lang="ts">
  // import Item from "$lib/hn/Item.svelte";
  import { initializeApp } from "firebase/app";
  import { getDatabase, ref, get, child } from "firebase/database";
  import moment from "moment";
  import CommentCard from "$lib/components/hn/CommentCard.svelte";
  // import type Comment from "../../../../types/hn/Comment";
  import { parseComment } from "$lib/types/hn/Comment";
  import type Story from "$lib/types/hn/Story";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { parseStory } from "$lib/types/hn/Story";
  import { Item, Comment } from "$lib/types/hn/item";

  import { writable } from "svelte/store";

  // export let data: { story: Story; comments: Promise<Comment[]> };
  export let data: PageData;
  let story = writable(data.item);

  const firebaseConfig = {
    databaseURL: "https://hacker-news.firebaseio.com",
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dbRef = ref(database);

  onMount(async () => {
    get(child(dbRef, `v0/item/${$story.id}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          let fullStory = Item.createFromOfficial(snapshot.val());
          if (fullStory.descendants !== $story.descendants) {
            // console.log(
            //   `descendants don't match: ${fullStory.descendants} !== ${$story.descendants}`,
            // );

            await updateStoryAndFetchComments(fullStory);
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // Assume this function is available to fetch a single comment by its ID
  async function fetchCommentById(id: number): Promise<Comment> {
    // Implementation to fetch a single comment by ID
    // This would involve an API call or database query
    const response = await fetch(`/api/hn/post/${id}`);
    const commentJson = await response.json();
    const comment = commentJson as Comment;
    return comment;
  }

  // Recursive function to fetch a comment and its children
  async function fetchCommentTree(
    commentId: number,
    rootId?: number,
  ): Promise<Comment> {
    const comment = await fetchCommentById(commentId);
    comment.root = rootId || commentId; // Set the root comment ID
    comment.isRoot = comment.id === comment.root;

    // If the comment has 'kids', recursively fetch their details
    if (comment.kids && comment.kids.length > 0) {
      const childComments = await Promise.all(
        comment.kids.map((kid) => fetchCommentTree(kid, comment.root)),
      );
      comment.comments = childComments;
    }

    return comment;
  }

  // Function to update the first story with the kids from the second and fetch all related comments
  async function updateStoryAndFetchComments(secondStory: Item): Promise<void> {
    // Update the 'kids' array of the first story with that from the second story
    $story.kids = secondStory.kids;
    $story.descendants = secondStory.descendants;
    $story.title = secondStory.title;
    $story.url = secondStory.url;
    $story.score = secondStory.score;
    $story.author = secondStory.author;
    $story.time = secondStory.time;
    $story.text = secondStory.text;
    $story.comments = secondStory.comments;

    // // If the second story has 'kids', fetch the comments and their nested children
    // if (secondStory.kids && secondStory.kids.length > 0) {
    //   const comments = await Promise.all(
    //     secondStory.kids.map((kid) => fetchCommentTree(kid)),
    //   );
    //   $story.comments = comments; // Update the 'comments' array with the fetched comment trees
    // } else {
    //   // If there are no 'kids', clear the 'comments' array
    //   $story.comments = [];
    // }

    // return firstStory;
  }
</script>

<svelte:head>
  <title>{$story.title} | beckr.dev - Hacker News</title>
  <meta name="description" content="Hacker News story" />
  <meta name="keywords" content="hacker news, story" />
  <meta name="author" content="Hacker News" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@newsycombinator" />
  <meta name="twitter:creator" content="@newsycombinator" />
  <meta property="og:title" content={$story.title} />
  <meta property="og:description" content="Hacker News story" />
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://reader.beckr.dev/hn/item/{$story.id}"
  />
  <meta property="og:site_name" content="beckr.dev reader" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:author" content="Hacker News" />
  <meta property="article:section" content="Hacker News" />
  <meta property="article:tag" content="hacker news" />
  <meta property="article:tag" content={$story.type} />
  <meta property="article:tag" content={$story.title} />
  <meta property="article:tag" content={$story.domain} />
  <meta property="article:tag" content={$story.url} />
</svelte:head>

<div class="">
  <div class="card">
    <div class="card-body">
      <a
        class="card-title flex-col place-items-start mx-auto"
        href={$story.url}
      >
        <article class="join gap-1">
          <div class="text-base md:text-lg lg:text-3xl xl:text-5xl">
            {$story.title}
          </div>
          {#if $story.domain}
            <div class="text-sm self-center">({$story.domain})</div>
          {/if}
        </article>
        <div class="tooltip place-self-center" data-tip="Reader view">
          <a
            href="/hn/readable/{$story.id}"
            class="link link-primary btn btn-ghost max-w-fit"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              class="fill-secondary"
              ><path
                d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
              />
            </svg>
          </a>
        </div>
        <div class="join gap-1 mx-auto">
          <div class="text-sm">{$story.score} points</div>
          <a
            class="text-sm hover:underline"
            href="https://news.ycombinator.com/user?id={$story.author}"
            >{$story.author}</a
          >
          <p class="text-sm">
            {moment.unix($story.time ?? 0).fromNow()}
          </p>
        </div>
      </a>
      <div class=" max-w-prose w-full mx-auto">
        {#if $story.text}
          <article class="text-wrap prose">{@html $story.text}</article>
        {/if}
      </div>
    </div>
  </div>
  <div class="">
    <ul class="divide-y divide-neutral mx-auto max-w-max">
      {#if $story.comments}
        {#each $story.comments as comment}
          <li class="">
            <div class="">
              <CommentCard {comment} />
            </div>
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>

<!-- {#await data.story}
  <div>Loading...</div>
{:then story}
  <div class="">
    <div class="card">
      <div class="card-body">
        <a
          class="card-title flex-col place-items-start mx-auto"
          href={story.url}
        >
          <article class="join gap-1">
            <div class="text-base md:text-lg lg:text-3xl xl:text-5xl">
              {story.title}
            </div>
            {#if story.domain}
              <div class="text-sm self-center">({story.domain})</div>
            {/if}
          </article>
          <div class="tooltip place-self-center" data-tip="Reader view">
            <a
              href="/hn/readable/{story.id}"
              class="link link-primary btn btn-ghost max-w-fit"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                class="fill-secondary"
                ><path
                  d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
                /></svg
              ></a
            >
          </div>
          <div class="join gap-1 mx-auto">
            <div class="text-sm">{story.score} points</div>
            <a
              class="text-sm hover:underline"
              href="https://news.ycombinator.com/user?id={story.author}"
              >{story.author}</a
            >
            <p class="text-sm">
              {moment.unix(story.time).fromNow()}
            </p>
          </div>
        </a>
        <div class=" max-w-prose w-full mx-auto">
          {#if story.text}
            <article class="text-wrap prose">{@html story.text}</article>
          {/if}
        </div>
      </div>
    </div>
    <div class="">
      <ul class="divide-y divide-neutral mx-auto max-w-max">
        {#if story.kids}
          {#await data.comments then loaded}
            {#each loaded as comment}
              <li class="">
                <div class="">
                  <CommentCard {comment} />
                </div>
              </li>
            {/each}
          {/await}
        {/if}
      </ul>
    </div>
  </div>
{/await} -->
