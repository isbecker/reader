<script lang="ts">
  import { onMount } from "svelte";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import Swiper from "swiper";
  import "swiper/swiper-bundle.css";
  import { swiperStore } from "../stores/app/swiper";

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
  let swiperInstance: Swiper;
  let sidebarOpen: boolean = false;

  onMount(() => {
    swiperInstance = new Swiper(".swiper-container", {
      slidesPerView: "auto",
      initialSlide: 1,
      resistanceRatio: 0.85,
      slideToClickedSlide: true,
      on: {
        slideChange: function (swiper: Swiper) {
          sidebarOpen = swiper.activeIndex === 0;
        },
      },
    });

    swiperStore.set(swiperInstance);
  });
</script>

<svelte:window bind:scrollY={y} />

  <main class="bg-base-100">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide max-w-fit">
          <Sidebar />
        </div>
        <div class="swiper-slide">
          <div class="">
            <Navbar {themes} {title} />
            <slot />
          </div>
          <div
            class="fixed inset-0 bg-opacity-80 z-[-1]"
            class:z-20={sidebarOpen}
            class:bg-base-300={sidebarOpen}
            class:z-[-1]={!sidebarOpen}
          ></div>
        </div>
      </div>
      <div
        class="fixed bottom-0 right-0 pb-2 pr-2 z-10"
        class:z-[-1]={sidebarOpen}
      >
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

    </div>
  </div>

  <div class="fixed bottom-0 right-0 pb-2 pr-2">
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
