<script lang="ts">
  import type { SocialPost } from "$lib/hf/schemas/SocialPostSchema";
  import moment from "moment";
  import { onMount } from "svelte";

  export let post: SocialPost;

  let lightboxOpen = false;
  let currentAttachmentIndex = 0;

  const openLightbox = (index) => {
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
    const handleKeydown = (event) => {
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
  <div class="container mx-auto p-4">
    <div class="card card-bordered card-compact bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="card-title text-sm">
          <a class="link" href="https://hf.co/{post.author?.name}">
            <div class="avatar">
              <div class="w-4 rounded-full">
                <img src={post.author.avatarUrl} alt={post.author?.name} />
              </div>
            </div>
            <span>{post.author?.name}</span>
          </a>
          about {moment(post.publishedAt).fromNow()} ago
        </div>
        <div class="">
          <article class="prose overflow-hidden break-words">
            {#each post.content as content}
              {#if content.type === "text"}
                {content.value}
              {/if}
              {#if content.type === "new_line"}
                <br />
              {/if}
              {#if content.type === "link"}
                <div class="badge badge-primary">
                  <a class="text text-primary-content" href={content.href}
                    >{content.href}</a
                  >
                </div>
              {/if}
              {#if content.type === "resource"}
                <div class="badge badge-info">
                  <a class="text text-info-content" href={content.url}>
                    <span class="text-ellipsis truncate overflow-clip">
                      {content.resource?.id}
                    </span>
                  </a>
                </div>
              {/if}
            {/each}
          </article>
          <div>
            <ul class="overflow-scroll w-screen join">
              {#each post.attachments ?? [] as attachment, index}
                <li>
                  <button
                    class="btn btn-ghost h-48 w-48 z-50"
                    on:click={() => openLightbox(index)}
                  >
                    {#if post.attachments?.[currentAttachmentIndex].type === "image"}
                      <img
                        src={attachment.url}
                        alt={attachment.type}
                        class=""
                      />
                    {:else if post.attachments?.[currentAttachmentIndex].type === "video"}
                      <video
                        src={attachment.url}
                        class="pointer-events-none"
                        controls
                      />
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
                <div class="flex items-center justify-between w-full p-16">
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

                  <div on:click|stopPropagation>
                    {#if post.attachments?.[currentAttachmentIndex].type === "image"}
                      <img
                        class="max-h-[90vh] max-w-full mx-auto"
                        src={post.attachments?.[currentAttachmentIndex].url}
                        alt={post.attachments?.[currentAttachmentIndex].type}
                      />
                    {:else if post.attachments?.[currentAttachmentIndex].type === "video"}
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
        </div>
      </div>
    </div>
  </div>
</div>
