<script lang="ts">
  import { theme } from "$lib/stores/app/theme";
  export let themes: string[];
</script>

<div class="dropdown dropdown-end z-50">
  <button tabindex="0" class="btn m-1">
    Theme
    <svg
      width="12px"
      height="12px"
      class="h-2 w-2 fill-current opacity-60 inline-block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      ><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"
      ></path></svg
    >
  </button>
  <ul
    class="dropdown-content z-30 p-2 shadow-2xl bg-base-300 rounded-box max-h-fit"
  >
    {#each themes as t}
      <li class="">
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller btn btn-sm btn-block btn-ghost justify-start text-accent"
          aria-label={t}
          value={t}
          checked={t === $theme}
          on:change={() => ($theme = t)}
        />
      </li>
    {/each}
  </ul>
</div>
