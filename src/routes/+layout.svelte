<script>
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
</script>

<main class="bg-base-100">
  <div class="drawer">
    <input id="side-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="sticky top-0 z-50 bg-secondary">
        <Navbar {themes} {title} />
      </div>

      <div class="">
        <slot />
      </div>
    </div>

    <div class="drawer-side z-50">
      <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay"
      ></label>
      <div class="min-w-fit">
        <Sidebar />
      </div>
    </div>
  </div>
</main>
