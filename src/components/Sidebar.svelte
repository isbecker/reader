<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { subscriptions } from "../stores/reddit/subscribed";

    const dispatch = createEventDispatcher();
    let newSub: string = "";

    function addSubreddit() {
        console.log(newSub);
        const newSubreddit: Subscription = {
            name: newSub,
            url: `/r/${newSub}`,
        };
        $subscriptions = [...$subscriptions, newSubreddit];

        newSub = "";
    }
    const links = [
        { name: "Top", url: "/hn/top" },
        { name: "Best", url: "/hn/best" },
        { name: "New", url: "/hn/new" },
        { name: "Ask", url: "/hn/ask" },
        { name: "Show", url: "/hn/show" },
        { name: "Jobs", url: "/hn/jobs" },
    ];
</script>

<div class="flex flex-col h-screen bg-base-100 w-min max-w-full">
    <div>
        <label
            for="side-drawer"
            aria-label="open sidebar"
            class="btn btn-square btn-ghost"
        >
            <svg
                class="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
                ><polygon
                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
                /></svg
            >
        </label>
    </div>
    <ul class="menu bg-base-100 rounded-box">
        <li>
            <details open>
                <summary
                    ><a class="btn btn-ghost self-stretch" href="/hn/top"
                        >Hacker News</a
                    ></summary
                >

                <ul class="menu bg-base-100 rounded-box">
                    {#each links as link}
                        <li>
                            <a
                                class="btn btn-ghost self-stretch"
                                href={link.url}>{link.name}</a
                            >
                        </li>
                    {/each}
                </ul>
            </details>
        </li>
        <li>
            <details open>
                <summary
                    ><a class="btn btn-ghost self-stretch" href="/r/all"
                        >Reddit</a
                    ></summary
                >
                <ul>
                    {#each $subscriptions as subreddit}
                        <li>
                            <a class="btn btn-ghost" href={subreddit.url}
                                >r/{subreddit.name}</a
                            >
                        </li>
                    {/each}
                    <li>
                        <div class="flex flex-row">
                            <input
                                id="new-subreddit"
                                class="input input-sm input-primary"
                                type="text"
                                placeholder="Add subreddit"
                                bind:value={newSub}
                            />
                            <button
                                class="btn btn-primary"
                                on:click={addSubreddit}
                            >
                                Add
                            </button>
                        </div>
                    </li>
                </ul>
            </details>
        </li>
    </ul>
</div>
