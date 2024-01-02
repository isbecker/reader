<script lang="ts">
    let open = false;
    export let subreddits: string[];

    export let currentSubreddit: string;

    function changeSubreddit(sub: string) {
        currentSubreddit = sub;
        // Do some other stuff
    }

    function addSubreddit() {
        const newSub = document.getElementById(
            "new-subreddit",
        ) as HTMLInputElement;
        if (newSub) {
            subreddits = [...subreddits, newSub.value];
        }
        newSub.value = "";
    }
</script>

<div class="flex flex-col h-screen bg-base-100">
    <div class="flex-grow">
        <ul class="menu p-4 w-80 min-h-full text-base-content">
            <!-- Sidebar content here -->
            {#each subreddits as sub}
                <div class="flex group" class:bg-secondary={sub === currentSubreddit}>
                    <button class="btn btn-ghost btn-sm rounded-btn grow"
                    on:click={() => {
                            changeSubreddit(sub);
                        }}
                        >{sub}</button
                    >
                    <!-- only visible on hover of the div -->
                    <button class="btn btn-ghost btn-sm rounded-btn hidden group-hover:inline"
                    on:click={() => {
                            subreddits = subreddits.filter((s) => s !== sub);
                        }}
                        >X</button>
                </div>
            {/each}
        </ul>
    </div>
    <div class="p-4 place-self-end">
        <input
            id="new-subreddit"
            placeholder="Add sub"
            class="input input-bordered input-accent"
            on:keypress={(event) => {
                if (event.key === "Enter") {
                    addSubreddit();
                }
            }}
        />
        <button
            class="btn btn-primary btn-sm rounded-btn "
            on:click={addSubreddit}>Add</button
        >
    </div>
</div>
