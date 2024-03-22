<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import {SvelteQueryDevtools} from "@tanstack/svelte-query-devtools"
  import type { PageData } from "./$types";

  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import "../app.css";
  import Navbar from "$lib/components/app/Navbar.svelte";
  import Sidebar from "$lib/components/app/Sidebar.svelte";

  export let data: PageData;
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
  let startX: number, startY: number;
  let drawer: HTMLDivElement;
  let swiping = false;
  let progress = 0; // Represents the progress of the swipe (0 to 1)

  let swipeDirection: "horizontal" | "vertical" | null = null; // New variable to track swipe direction

  function isScrollable(element: HTMLElement) {
    const overflowX = window.getComputedStyle(element).overflowX;
    const isScrollable = overflowX === "auto" || overflowX === "scroll";
    const canScroll = element.scrollWidth > element.clientWidth;
    return isScrollable && canScroll;
  }

  // Function to check if the event target or any of its parents is scrollable
  function originatedFromScrollableElement(target: EventTarget | null) {
    while (target !== document.body) {
      // Stop at the body element
      if (target && isScrollable(target as HTMLElement)) {
        return true;
      }
      target = (target as HTMLElement)?.parentNode;
    }
    return false;
  }

  // Start tracking the swipe
  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) return; // Ignore multi-touch
    // Check if the touch started in a scrollable element
    if (originatedFromScrollableElement(event.target)) {
      // Optionally, handle this case differently or return to ignore the swipe
      return;
    }

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    swiping = true;
    swipeDirection = null; // Reset swipe direction at start
    drawer.style.transition = "none"; // Disable transition for smooth swiping
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length > 1 || !swiping) return;

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    // Determine the swipe direction if it hasn't been set
    if (!swipeDirection && (diffX > 10 || diffY > 10)) {
      // Using 10px as a threshold
      swipeDirection = diffX > diffY ? "horizontal" : "vertical";
    }

    if (swipeDirection === "horizontal") {
      event.preventDefault(); // Prevent vertical scrolling during a horizontal swipe
      const swipedDistance = currentX - startX;
      if (drawerOpen) {
        const closingSwipePercentage = Math.max(
          1 - (startX - currentX) / drawer.offsetWidth,
          0,
        );
        progress = Math.min(1, closingSwipePercentage);
      } else {
        const openingSwipePercentage = Math.min(
          swipedDistance / drawer.offsetWidth,
          1,
        );
        progress = openingSwipePercentage;
      }
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    if (event.touches.length > 1) return; // Ignore multi-touch
    swiping = false;
    drawer.style.transition = "transform 300ms ease"; // Re-enable transition

    // Determine whether to open or close the drawer based on the final progress value
    if (swipeDirection === "horizontal") {
      if (progress > 0.33) {
        drawerOpen = true;
      } else {
        drawerOpen = false;
      }
      progress = drawerOpen ? 1 : 0;
    }

    // Reset or set progress based on the drawer's state
    progress = drawerOpen ? 1 : 0;
    swipeDirection = null; // Reset swipe direction at the end of a swipe
  }

  $: progress = drawerOpen ? 1 : 0;
  $: drawerStyle = `--drawer-progress: ${progress};`;
</script>

<svelte:window
  bind:scrollY={y}
  on:touchstart={handleTouchStart}
  on:touchmove|nonpassive={handleTouchMove}
  on:touchend={handleTouchEnd}
/>

<QueryClientProvider client={data.queryClient}>
  <main class="bg-base-100">
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

        <div>
          <slot />
        </div>
      </div>

      <div class="drawer-side z-50">
        <label
          for="side-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        />
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
  <SvelteQueryDevtools initialIsOpen={true} />
</QueryClientProvider>

<style>
  :global(.drawer-side > *:not(.drawer-overlay)) {
    transform: translateX(
      calc(-100% * (1 - var(--drawer-progress)))
    ) !important;
  }
</style>
