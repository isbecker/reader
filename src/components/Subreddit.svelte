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
      is_read: false,
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
      is_read: true,
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
      is_read: false,
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
      is_read: false,
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
      is_read: false,
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
      is_read: false,
    },
  ];
</script>

<div class="bg-base-100">
  {subreddit}
  <ul class="flex flex-col gap-4 ">
    {#each posts as post}
      <li class="w-full hover:bg-base-300" class:opacity-20={post.is_read}>
        <div class="card card-bordered flex flex-row">
          <div class="flex flex-col p-2 gap-1 shrink-0">
            <figure class="">
              <img src={post.image} alt="img" />
            </figure>
            <button class="btn btn-accent btn-outline btn-sm">
              {post.comments.length} comments
            </button>
          </div>
          <div class="card-body">
            <div class="flex flex-col">
              <div class="card-title">
                {post.title}
              </div>
              <div class="">
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
