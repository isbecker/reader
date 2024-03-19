<script lang="ts">
  import type { SocialPost } from "$lib/types/hf/schemas/SocialPostSchema";
  import hljs from "highlight.js";
  import "highlight.js/styles/github.css";
  import moment from "moment";
  import { onMount } from "svelte";

  export let post: SocialPost;

  let lightboxOpen = false;
  let currentAttachmentIndex = 0;

  $: fullPost = post.comments !== undefined;

  const openLightbox = (index: number) => {
    currentAttachmentIndex = index;
    lightboxOpen = true;
  };

  const closeLightbox = () => {
    lightboxOpen = false;
  };

  const showNext = () => {
    if (currentAttachmentIndex < (post.attachments?.length ?? 0) - 1) {
      currentAttachmentIndex++;
    }
  };

  const showPrevious = () => {
    if (currentAttachmentIndex > 0) {
      currentAttachmentIndex--;
    }
  };

  // Close lightbox on ESC key press
  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="flex justify-center">
  <div class="container max-w-4xl mx-auto p-1">
    <div class="card card-bordered card-compact bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="card-title text-sm">
          <a class="link link-primary" href="https://hf.co/{post.author?.name}">
            <div class="avatar">
              <div class="w-4 rounded-full">
                <img src={post.author.avatarUrl} alt={post.author?.name} />
              </div>
            </div>
            <span>{post.author?.name}</span>
          </a>
          <div class="text-secondary">
            about {moment(post.publishedAt).fromNow()}
          </div>
        </div>
        <div class="container">
          <div class="relative">
            <div
              class="overflow-hidden"
              class:max-h-[10lh]={!fullPost}
              class:max-h-full={fullPost}
            >
              <article class="prose break-words">
                {#each post.content as content}
                  {#if content.type === "text"}
                    {content.value}
                  {/if}
                  {#if content.type === "new_line"}
                    <br />
                  {/if}
                  {#if content.type === "link"}
                    <div class="badge badge-primary max-w-prose overflow-clip">
                      <a
                        class="text text-primary-content truncate"
                        href={content.href}>{content.href}</a
                      >
                    </div>
                  {/if}
                  {#if content.type === "inline_code"}
                    <code>{content.code}</code>
                  {/if}
                  {#if content.type === "code_fence"}
                    <pre><code
                        >{@html hljs.highlightAuto(content.code, [
                          "python",
                          "javascript",
                          "typescript",
                          "rust",
                        ]).value}</code
                      ></pre>
                  {/if}
                  {#if content.type === "mention"}
                    <a href="https://hf.co/{content.user}">@{content.user}</a>
                  {/if}
                  {#if content.type === "resource"}
                    <div class="badge badge-accent max-w-prose">
                      <a class="text text-info-content" href={content.url}>
                        <span class="truncate">
                          {content.resource?.id}
                        </span>
                      </a>
                    </div>
                  {/if}
                {/each}
              </article>
              {#if !fullPost}
                <div
                  class="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-tl from-base-100 to-transparent"
                />
                <a
                  href="/hf/posts/{post.author.name}/{post.slug}"
                  class="link btn btn-sm btn-ghost absolute bottom-[-16px] right-0"
                  >...read more</a
                >
              {/if}
            </div>
          </div>

          <div>
            <ul class="overflow-scroll w-screen join">
              {#each post.attachments ?? [] as attachment, index}
                <li>
                  <button
                    class="btn btn-ghost h-40 w-40 z-50"
                    on:click={() => openLightbox(index)}
                  >
                    {#if post.attachments?.[currentAttachmentIndex].type === "image"}
                      <img
                        src={attachment.url}
                        alt={attachment.type}
                        class=""
                      />
                    {:else if post.attachments?.[currentAttachmentIndex].type === "video"}
                      <!-- svelte-ignore a11y-media-has-caption -->
                      <video src={attachment.url} class="pointer-events-none" />
                    {/if}
                  </button>
                </li>
              {/each}
            </ul>

            {#if lightboxOpen}
              <button
                class="modal modal-open fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                on:click={closeLightbox}
              >
                <div class="flex items-center justify-between w-full">
                  <button
                    class="p-2 leading-none z-50 cursor-pointer"
                    on:click|stopPropagation={showPrevious}
                    class:opacity-0={currentAttachmentIndex === 0}
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48"
                      viewBox="0 -960 960 960"
                      width="48"
                      class="fill-info"
                      ><path
                        d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"
                      /></svg
                    ></button
                  >

                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div on:click|stopPropagation>
                    {#if post.attachments?.[currentAttachmentIndex].type === "image"}
                      <img
                        class="max-h-[90vh] max-w-full mx-auto"
                        src={post.attachments?.[currentAttachmentIndex].url}
                        alt={post.attachments?.[currentAttachmentIndex].type}
                      />
                    {:else if post.attachments?.[currentAttachmentIndex].type === "video"}
                      <!-- svelte-ignore a11y-media-has-caption -->
                      <video
                        class="max-h-[90vh] max-w-full mx-auto"
                        src={post.attachments?.[currentAttachmentIndex].url}
                        autoplay
                        controls
                      />
                    {/if}
                  </div>

                  <button
                    class="p-2 leading-none z-50 cursor-pointer"
                    on:click|stopPropagation={showNext}
                    class:opacity-0={currentAttachmentIndex ===
                      (post.attachments?.length ?? 0) - 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48"
                      viewBox="0 -960 960 960"
                      width="48"
                      class="fill-info"
                      ><path
                        d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"
                      /></svg
                    >
                  </button>
                </div>
                <button
                  class="btn absolute top-4 right-4 text-base-content text-2xl"
                  on:click={closeLightbox}>&times;</button
                >
                <form method="dialog" class="modal-backdrop">
                  <button>close</button>
                </form>
              </button>
            {/if}
          </div>

          <div id="reactions-{post.slug}" class="join gap-1">
            {#each post.reactions as reaction}
              <div class="badge badge-info">
                <div class="badge-icon">
                  <span>{reaction.reaction} {reaction.count}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
