<script lang="ts">
    // import fetch from "cross-fetch";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    import Navbar from "../components/Navbar.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import Subreddit from "../components/Subreddit.svelte";

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

<main class="bg-base-100" data-theme={theme}>
    <div class="drawer">
        <input id="side-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
            <!-- Navbar -->
            <Navbar {theme} {themes} setTheme={changeTheme} />
            <!-- Page content here -->
            <div class="min-h-screen min-w-screen p-4">
                <Subreddit subreddit="technology"></Subreddit>
            </div>
        </div>
        <div class="drawer-side">
            <label
                for="side-drawer"
                aria-label="close sidebar"
                class="drawer-overlay"
            ></label>
            <Sidebar {subreddits} currentSubreddit="technology" />
        </div>
    </div>
</main>

<style>
</style>
