<script>
  import "../../app.css";
  // import Navbar from "../../components/Navbar.svelte";
  // const themes = [
  //   "light",
  //   "dark",
  //   "synthwave",
  //   "retro",
  //   "cyberpunk",
  //   "forest",
  //   "aqua",
  //   "lofi",
  //   "fantasy",
  //   "wireframe",
  //   "black",
  //   "dracula",
  //   "business",
  //   "acid",
  //   "lemonade",
  //   "night",
  //   "coffee",
  //   "dim",
  //   "nord",
  //   "sunset",
  // ];
  // let theme = "dark";
</script>

<!-- <div class="sticky top-0 z-50 bg-secondary">
  <Navbar {theme} {themes} currentSubreddit="top" />
  <div class="tooltip tooltip-bottom" data-tip="Top">
    <a class="btn btn-ghost text-xl" href="/hn" data-sveltekit-preload-data
      >Home</a
    >
  </div>
  <a class="btn btn-ghost text-xl" href="/hn/new" data-sveltekit-preload-data
    >New</a
  >
  <a class="btn btn-ghost text-xl" href="/hn/best" data-sveltekit-preload-data
    >Best</a
  >
  <a class="btn btn-ghost text-xl" href="/hn/ask" data-sveltekit-preload-data
    >Ask</a
  >
  <a class="btn btn-ghost text-xl" href="/hn/show" data-sveltekit-preload-data
    >Show</a
  >
  <a class="btn btn-ghost text-xl" href="/hn/jobs" data-sveltekit-preload-data
    >Jobs</a
  >
</div> -->

<slot />
