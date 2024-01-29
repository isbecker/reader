<script lang="ts">
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  const themes = [
    "latte",
    "frappe",
    "macchiato",
    "mocha",
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
  let theme = "dark";
  let title = "";
  let y = 0;
</script>

<svelte:window bind:scrollY={y} />

<main class="bg-base-100">
  <div class="drawer">
    <input id="side-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content h-full w-full">
      <!-- Navbar -->
      <div class="sticky top-0 z-50 bg-secondary">
        <Navbar {themes} {title} />
      </div>

      <slot />
    </div>

    <div class="drawer-side z-50">
      <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay"
      ></label>
      <div class="min-w-fit">
        <Sidebar />
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 right-0">
    <button
      class="btn btn-circle btn-base-300 hover:btn-secondary"
      on:click={() => {
        y = 0;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        class="fill-accent"
        ><path
          d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"
        /></svg
      >
    </button>
  </div>
</main>
