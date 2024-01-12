<script lang="ts">
    import Navbar from "../components/Navbar.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import Subreddit from "../components/Subreddit.svelte";

    let theme = "dark";
    const themes = [
        "light",
        "dark",
        "synthwave",
        "retro",
        "cyberpunk",
        "forest",
        "aqua",
        "lofi",
        "fantasy",
        "wireframe",
        "black",
        "dracula",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "dim",
        "nord",
        "sunset",
    ];
    let subreddits = ["technology", "sveltejs"]; // Example subreddits
    let subreddit = "technology";

    // async function loadCommentsForPost(post: RedditPost) {
    //     try {
    //         // console.log(`Fetching comments for post: ${post.id}`);
    //         const response = await fetch(
    //             `/api/reddit/${post.subreddit}/comments/${post.id}`,
    //         );
    //         if (response.ok) {
    //             let json = await response.json();
    //             if (typeof json === "string") {
    //                 // console.log(`Data: ${res}`);
    //                 json = JSON.parse(json);
    //             }

    //             // Assuming the comments are in the second "Listing" object
    //             post.comments = parseComments(json[1].data.children);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching comments for post:", post.id, error);
    //     }
    // }
</script>

<main class="bg-base-100 min-h-screen min-w-screen">
    <div class="drawer">
        <input id="side-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
            <!-- Navbar -->
            <div class="sticky top-0 z-50">
                <Navbar {theme} {themes} currentSubreddit={subreddit} />
            </div>

            <!-- Page content here -->
            <div class="min-h-screen min-w-screen p-4">
                <Subreddit subredditName={subreddit} />
            </div>
        </div>
        <div class="drawer-side z-50">
            <label
                for="side-drawer"
                aria-label="close sidebar"
                class="drawer-overlay"
            ></label>
            <Sidebar
                {subreddits}
                currentSubreddit={subreddit}
                on:notify={(event) => (subreddit = event.detail.subreddit)}
            />
        </div>
    </div>
</main>

<style>
</style>
