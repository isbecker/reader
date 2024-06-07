<script lang="ts">
    import ThemePicker from "./ThemePicker.svelte";

    export let themes: string[];
    export let title: string;
</script>

<div class="navbar bg-primary text-primary-content flex-row">
    <div class="">
        <label
            for="side-drawer"
            aria-label="open sidebar"
            class="btn btn-square btn-ghost"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-current"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                ></path></svg
            >
        </label>
    </div>
    <div class="grow">
        <p class="text-xl underline text-accent">{title}</p>
    </div>
    <div class="">
        <ThemePicker {themes} />
    </div>
</div>
