<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { subscriptions } from "../stores/reddit/subscribed";
    import type Subscription from "../types/reddit/Subscription";

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
    const hnLinks = [
        { name: "Top", url: "/hn/top" },
        { name: "Best", url: "/hn/best" },
        { name: "New", url: "/hn/new" },
        { name: "Ask", url: "/hn/ask" },
        { name: "Show", url: "/hn/show" },
        { name: "Jobs", url: "/hn/jobs" },
    ];
    const hfLinks = [{ name: "Posts", url: "/hf/posts" }];
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
                    {#each hnLinks as link}
                        <li>
                            <a
                                class="btn btn-ghost self-stretch"
                                href={link.url}
                                >{link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </details>
        </li>
        <li>
            <details open>
                <summary>
                    <div class="indicator">
                        <span class="indicator-item badge badge-info mt-[.75rem]">
                            beta
                        </span>
                        <a class="btn btn-ghost self-stretch" href="/hf/posts">
                            Hugging Face
                        </a>
                    </div>
                </summary>

                <ul class="menu bg-base-100 rounded-box">
                    {#each hfLinks as link}
                        <li>
                            <a
                                class="btn btn-ghost self-stretch"
                                href={link.url}
                                >{link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </details>
        </li>
        <li>
            <details open>
                <summary
                    ><a
                        class="btn btn-ghost self-stretch"
                        href="/r/{$subscriptions
                            .flatMap((s) => s.name)
                            .join('+')}">Reddit</a
                    ></summary
                >
                <ul>
                    {#each $subscriptions as subreddit}
                        <li>
                            <div class="flex flex-row">
                                <a
                                    class="btn btn-ghost grow"
                                    href={subreddit.url}>r/{subreddit.name}</a
                                >
                                <button
                                    class="btn btn-ghost"
                                    on:click={() => {
                                        $subscriptions = $subscriptions.filter(
                                            (s) => s.name !== subreddit.name,
                                        );
                                    }}
                                    ><svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                        class="fill-warning"
                                        ><path
                                            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                                        /></svg
                                    ></button
                                >
                            </div>
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
