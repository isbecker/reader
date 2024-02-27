<script lang="ts">
  import { onMount } from "svelte";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
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
  let title = "";
  let y = 0;

  injectSpeedInsights();

  let drawerOpen: boolean = false;
  let startX: number, currentX: number;
  let drawer: HTMLDivElement;
  let swiping = false;
  let progress = 0; // Represents the progress of the swipe (0 to 1)

  // Start tracking the swipe
  function handleTouchStart(event: TouchEvent) {
    startX = event.touches[0].clientX;
    currentX = startX;
    swiping = true;
  }

  function handleTouchMove(event: TouchEvent) {
    if (!swiping) return;

    currentX = event.touches[0].clientX;
    const swipedDistance = currentX - startX;

    // Calculate the swipe distance as a percentage of the drawer's or screen's width
    const swipePercentage = swipedDistance / window.innerWidth;
    progress = Math.min(swipePercentage, 1);
  }

  function handleTouchEnd() {
    swiping = false;
    if (progress > 0.33) {
      progress = 1; // Fully open the drawer if more than half swiped
      drawerOpen = true;
    } else {
      progress = 0; // Close the drawer
      drawerOpen = false;
    }
  }

  $: drawerStyle = `--drawer-progress: ${progress}`;
  $: progress = drawerOpen ? 1 : 0;
</script>

<svelte:window bind:scrollY={y} />

  <main class="bg-base-100">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide max-w-fit">
          <Sidebar />
  <main class="bg-base-200">
    <div class="drawer">
      <input
        id="side-drawer"
        type="checkbox"
        class="drawer-toggle"
        bind:checked={drawerOpen}
      />
      <div class="drawer-content">
        <!-- Navbar -->
        <div class="sticky top-0 z-50 bg-secondary">
          <Navbar {themes} {title} />
        </div>

        <div
          on:touchstart={handleTouchStart}
          on:touchmove={handleTouchMove}
          on:touchend={handleTouchEnd}
        >
          <slot />
        </div>
      </div>

      <div class="drawer-side z-50">
        <label
          for="side-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="min-w-fit" bind:this={drawer} style={drawerStyle}>
          <Sidebar />
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 right-0 pb-2 pr-2 z-[100]">
      <button
        class="btn btn-circle btn-base-300 hover:btn-secondary"
        on:click={() => (y = 0)}
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

<style>
  :global(.drawer-side > *:not(.drawer-overlay)) {
    transform: translateX(calc(-100% * (1 - var(--drawer-progress))));
  }
</style>
