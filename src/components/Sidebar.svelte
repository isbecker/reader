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
</script>

<div class="flex flex-col h-screen bg-base-100 w-fit">
    <ul class="menu bg-base-200 rounded-box">
        <li>
            <details open>
                <summary><a href="/hn/top">Hacker News</a></summary>
                <ul>
                    <li><a href="/hn/top">Top</a></li>
                    <li><a href="/hn/best">Best</a></li>
                    <li><a href="/hn/new">New</a></li>
                    <li><a href="/hn/ask">Ask</a></li>
                    <li><a href="/hn/show">Show</a></li>
                    <li><a href="/hn/jobs">Jobs</a></li>
                </ul>
            </details>
        </li>
        <li>
            <details open>
                <summary><a href="/r/all">Reddit</a></summary>
                <ul>
                    {#each $subscriptions as subreddit}
                        <li><a href={subreddit.url}>r/{subreddit.name}</a></li>
                    {/each}
                    <li>
                        <div>
                            <input
                                id="new-subreddit"
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
