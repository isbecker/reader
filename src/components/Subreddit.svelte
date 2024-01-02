<script lang="ts">
    import type Post from "../types/reddit/Post";

    export let subreddit: string;
    let posts: Post[] = [
        {
            id: "1",
            author: "u/username",
            subreddit: subreddit,
            permalink: "/r/subreddit/comments/1/post_title/",
            slug: "post_title",
            title: "Post Title",
            content: "Post Content",
            excerpt:
                "Here is a very long content that might need to end up growing and making other stuff smaller...",
            date: Date.now(),
            length: 1,
            image: "https://source.unsplash.com/random/100x100",
            comments: [],
        },
        {
            id: "2",
            author: "u/username",
            subreddit: subreddit,
            permalink: "/r/subreddit/comments/1/post_title/",
            slug: "post_title",
            title: "Post Title",
            content: "Post Content",
            excerpt: "Post Excerpt",
            date: Date.now(),
            length: 1,
            image: "https://source.unsplash.com/random/100x100",
            comments: [],
        },

        {
            id: "3",
            author: "u/username",
            subreddit: subreddit,
            permalink: "/r/subreddit/comments/1/post_title/",
            slug: "post_title",
            title: "Post Title",
            content: "Post Content",
            excerpt: "Post Excerpt",
            date: Date.now(),
            length: 1,
            image: "https://source.unsplash.com/random/100x100",
            comments: [],
        },
    ];
</script>

<div class="bg-base-100">
    {subreddit}
    <ul class="flex flex-col flex-row gap-4 place-items-start">
        {#each posts as post}
            <li class="w-full hover:bg-base-300">
                <div class="card card-bordered flex flex-row justify-stretch">
                    <div class="flex flex-col p-2 gap-1">
                        <figure><img src={post.image} alt="img" /></figure>
                        <div
                            class="badge badge-primary-content badge-outline grow "
                        >
                            {post.comments.length} comments
                        </div>
                    </div>
                    <div class="card-body grow">
                        <div class="flex flex-col">
                            <div class="card-title">
                                {post.title}
                            </div>
                            <div class="grow">
                                {post.excerpt}
                            </div>
                        </div>
                    </div>
                    <div class="card-actions place-self-end p-2">
                        <button class="btn btn-accent btn-sm">More</button>
                    </div>
                </div>
            </li>
        {/each}
    </ul>
</div>
