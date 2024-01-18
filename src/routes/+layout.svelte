<script>
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  const themes = [
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
</script>

<main class="bg-base-100">
  <div class="drawer">
    <input id="side-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="sticky top-0 z-50 bg-secondary">
        <Navbar {theme} {themes} currentSubreddit="" />
      </div>

      <slot />
    </div>

    <div class="drawer-side z-50">
      <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay"
      ></label>
      <div>Hello</div>
    </div>
  </div>
</main>
