<script lang="ts">
    import type Comment from "./+page.svelte";

    export let comment: Comment;
    let isCollapsed = true; // Tracks whether replies are collapsed or expanded

    function toggleCollapse() {
        isCollapsed = !isCollapsed;
    }

    // Function to check if a comment has replies
    function hasReplies(comment: Comment) {
        return comment.replies && comment.replies.length > 0;
    }
</script>

<div class="comment text-neutral-content">
    <p>
        <strong>{comment.author}</strong>: {comment.body}
        {#if hasReplies(comment)}
            <button
                class="btn btn-xs btn-secondary text-secondary-content ml-2"
                on:click={(event) => {
                    event.stopPropagation();
                    toggleCollapse();
                }}
            >
                {isCollapsed ? "Show Replies" : "Hide Replies"}
            </button>
        {/if}
    </p>

    {#if hasReplies(comment) && !isCollapsed}
        <div class="nested-comments transition ease-in-out duration-1000">
            {#each comment.replies as reply}
                <svelte:self comment={reply} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .comment {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
    }
    .nested-comments {
        margin-left: 1rem;
        border-left: 1px solid #ccc;
        padding-left: 1rem;
    }
</style>
