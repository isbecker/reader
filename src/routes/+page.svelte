<script lang="ts">
    // import fetch from "cross-fetch";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    import Comment from "./Comment.svelte";

    interface RedditPost {
        id?: string;
        title: string;
        selftext: string;
        url: string;
        imageUrl: string | null;
        num_comments: number;
        commentsVisible?: boolean;
        upvotes?: number;
        permalink?: string;
        comments?: Comment[];
        subreddit?: string;
    }

    interface Comment {
        id: string;
        body: string;
        author: string;
        replies?: Comment[]; // Nested comments
    }

    interface SelectedArticle {
        title: string;
        content: string;
        excerpt?: string;
        length?: number;
    }
    let theme = "cyberpunk";
    const themes = [
        "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ];
    let isSidebarOpen = false;
    let subreddits = ["technology", "sveltejs"]; // Example subreddits
    let newSubreddit = "";
    let visibleCommentsPostId: string | null = null;

    let posts: RedditPost[] = [];
    let subreddit = "gaming";
    let feed: any[] = [];
    let selectedArticleContent: string | null = null;

    let selectedArticle: SelectedArticle | null = null;
    let isLoading = false;
    let comments: Comment[] = [];
    // Create a writable store
    const scrollPos = writable(0);

    onMount(async () => {
        document.addEventListener("keydown", handleKeyDown);
        await fetchSubreddit(subreddit);
    });

    function changeTheme(newTheme: string) {
        theme = newTheme;
        console.log(`Theme: ${theme}`);
    }

    async function fetchSubreddit(subreddit: string) {
        try {
            const response = await fetch(`/api/reddit/${subreddit}`);
            if (response.ok) {
                const data = await response.json();
                // console.log(`Data: ${response.text()}`);
                posts = await parseSubreddit(data);

                // console.log(`Feed: ${posts}`);
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            selectedArticle = null;
            visibleCommentsPostId = null;
        }
    }

    function addSubreddit() {
        if (newSubreddit) {
            subreddits = [...subreddits, newSubreddit];
            newSubreddit = "";
        }
    }

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    async function parseSubreddit(json: any) {
        const parsedData: RedditPost[] = await Promise.all(
            json.data.children.map(async (child: any) => {
                return {
                    title: child.data.title,
                    subreddit: child.data.subreddit,
                    selftext: child.data.selftext,
                    url: child.data.url,
                    num_comments: child.data.num_comments,
                    commentsVisible: false,
                    upvotes: child.data.ups,
                    imageUrl: await extractImageUrl(child.data),
                    permalink: child.data.permalink,
                    id: child.data.id,
                    comments: [],
                };
            }),
        );
        await Promise.all(parsedData.map(loadCommentsForPost));
        return parsedData;
    }
    async function extractImageUrl(data: any): Promise<string | null> {
        // Logic to extract image URL from the post data
        if (
            data.thumbnail &&
            data.thumbnail !== "self" &&
            data.thumbnail !== "default"
        ) {
            return data.thumbnail; // Simple case - use the thumbnail URL
        } else if (
            data.preview &&
            data.preview.images &&
            data.preview.images.length > 0
        ) {
            return data.preview.images[0].source.url; // Extract from preview images
        }
        // Add more conditions if needed based on the structure of the Reddit API response
        return null;
    }

    function isImageUrl(url: string): boolean {
        return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
    }

    async function loadArticleContent(post: RedditPost) {
        selectedArticle = null;
        isLoading = true;
        // Update the store with the current scroll position
        scrollPos.set(window.scrollY);
        try {
            if (isImageUrl(post.url)) {
                // For image posts, just set the selectedArticle with the image
                selectedArticle = {
                    title: post.title,
                    content: `<img src="${post.url}" alt="${post.title}" />`,
                };
            } else {
                const response = await fetch(
                    `/api/content/readable?url=${encodeURIComponent(post.url)}`,
                );
                if (response.ok) {
                    const json = await response.json();
                    // console.log(`Data: ${json.article.title}`);
                    // console.log(`Data: ${json}`)
                    selectedArticle = {
                        title: json.article?.title,
                        content: json.article?.content,
                    };
                    // selectedArticleContent = json.content;
                    // Process and display the content as needed
                } else {
                    console.error("Error fetching article");
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            isLoading = false;
        }
    }
    async function loadCommentsForPost(post: RedditPost) {
        try {
            // console.log(`Fetching comments for post: ${post.id}`);
            const response = await fetch(
                `/api/reddit/${post.subreddit}/comments/${post.id}`,
            );
            if (response.ok) {
                let json = await response.json();
                if (typeof json === "string") {
                    // console.log(`Data: ${res}`);
                    json = JSON.parse(json);
                }

                // Assuming the comments are in the second "Listing" object
                post.comments = parseComments(json[1].data.children);
            }
        } catch (error) {
            console.error("Error fetching comments for post:", post.id, error);
        }
    }

    function parseComments(children: any[]): Comment[] {
        return children
            .map((child) => {
                if (child.kind === "t1") {
                    const commentData = child.data;
                    const comment: Comment = {
                        id: commentData.id,
                        author: commentData.author,
                        body: commentData.body,
                        replies: [],
                    };

                    if (commentData.replies && commentData.replies.data) {
                        comment.replies = parseComments(
                            commentData.replies.data.children,
                        );
                    }

                    // console.log(`Comment: ${comment}`);

                    return comment;
                }
                return null;
            })
            .filter((comment) => comment !== null) as Comment[]; // Filter out null values
    }
    async function toggleComments(post: RedditPost) {
        posts = await Promise.all(
            posts.map(async (p) => {
                if (p.id === post.id) {
                    if (!p.comments) await loadCommentsForPost(p);
                    return { ...p, commentsVisible: !p.commentsVisible };
                }
                return p;
            }),
        );
    }
</script>

<main class="" data-theme={theme}>
    <div class="flex">
        <!-- Top Navbar -->
        <nav class="navbar fixed top-0 left-0 right-0 z-30">
            <div class="flex-none">
                <button
                    class="btn btn-square btn-ghost"
                    on:click={toggleSidebar}
                >
                    <!-- Hamburger Icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="inline-block w-6 h-6 stroke-current"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </button>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a class="btn btn-ghost normal-case text-xl"
                    >Reader for r/{subreddit}</a
                >

                <!-- Theme picker -->
                <div class="dropdown ml-auto">
                    <div tabindex="0" role="button" class="btn m-1">
                        Theme
                        <svg
                            width="12px"
                            height="12px"
                            class="h-2 w-2 fill-current opacity-60 inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2048 2048"
                        >
                            <path
                                d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"
                            ></path>
                        </svg>
                    </div>
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <ul
                        tabindex="0"
                        class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 bg-neutral"
                    >
                        {#each themes as t}
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    class="theme-controller btn btn-neutral-content btn-sm btn-block btn-ghost justify-start capitalize"
                                    aria-label={t}
                                    value={t}
                                    on:click={() => {
                                        changeTheme(t);
                                    }}
                                />
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Sidebar -->
        <div
            class={`fixed z-20 transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform top-0 bottom-0 w-64 bg-base-100`}
        >
            <div
                class="overflow-y-auto pt-16 pb-4 h-screen bg-primary"
            >
                <ul class="menu p-0 bg-neutral text-neutral-content">
                    {#each subreddits as subreddit}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <li class=" bg-neutral text-neutral-content">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <a on:click={() => fetchSubreddit(subreddit)}>
                                {subreddit}</a
                            >
                        </li>
                    {/each}
                    <li class="menu-item bg-neutral text-neutral-content">
                        <input
                            type="text"
                            bind:value={newSubreddit}
                            placeholder="Add subreddit"
                            class="input input-bordered w-full"
                        />
                        <button
                            class="btn btn-primary mt-2 bg-neutral text-neutral-content"
                            on:click={addSubreddit}>Add</button
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Main Content -->
        <div class={`flex-1 ${isSidebarOpen ? "ml-64" : ""} pt-16`}>
            <div class="p-4 overflow-y-auto h-full">
                {#if isLoading}
                    <div class="loading loading-lg"></div>
                {/if}
                {#if !selectedArticle && !isLoading}
                    {#each posts as post}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="card bg-base-100 hover:bg-base-200 cursor-pointer mb-4 bg-neutral"
                            on:click={() => loadArticleContent(post)}
                        >
                            <div
                                class="card-body bg-neutral"
                            >
                                <!-- Post Title and Upvotes -->
                                <div
                                    class="flex items-center justify-between bg-neutral"
                                >
                                    <h2
                                        class="card-title flex-grow text-neutral-content"
                                    >
                                        {post.title}
                                    </h2>
                                    <div
                                        class="badge badge-accent"
                                    >
                                        {post.upvotes} Upvotes
                                    </div>
                                </div>

                                <!-- Thumbnail and Main Content -->
                                <div
                                    class="flex bg-neutral"
                                >
                                    {#if post.imageUrl}
                                        <div class="flex-shrink-0">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                class="w-24 h-24 object-cover mr-4"
                                            />
                                        </div>
                                    {/if}
                                    <div
                                        class="flex-grow bg-neutral"
                                    >
                                        <p class="text-neutral-content">
                                            {post.selftext ||
                                                "Click to read more..."}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    class="btn btn-outline btn-accent transition duration-750 ease-in-out"
                                    on:click={async (event) => {
                                        event.stopPropagation();
                                        await toggleComments(post);
                                    }}
                                >
                                    {post.num_comments} Comments
                                </button>
                                <!-- Expandable Comments Section -->
                                {#if post.comments && post.commentsVisible}
                                    <div
                                        class="text-neutral-content transition duration-750 ease-in-out"
                                    >
                                        {#each post.comments as comment}
                                            <Comment
                                                {comment}
                                            />
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {/if}
                {#if selectedArticle}
                    <div class="hero bg-neutral text-neutral-content">
                        <div
                            class="hero-content bg-neutral text-neutral-content"
                        >
                            <p class="py-6 bg-neutral text-neutral-content">
                                {@html selectedArticle.content}
                            </p>
                            <button
                                class="btn btn-primary"
                                on:click={() => {
                                    selectedArticle = null;
                                }}
                            >
                                Back to list
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    /* Ensure the sidebar starts below the navbar */
    .navbar {
        height: 4rem;
    }
    .top-16 {
        top: 4rem;
    } /* Height of the navbar */

    
    .nested-comments {
        margin-left: 1rem; /* Adjust to ensure it fits within the card */
    }
</style>
