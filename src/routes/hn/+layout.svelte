<script>
  import "../../app.css";
</script>

<div data-theme="dark" class="navbar sticky top-0 z-50">
  <div class="tooltip tooltip-bottom" data-tip="Top">
    <a class="btn btn-ghost text-xl" href="/hn">Home</a>
  </div>
  <a class="btn btn-ghost text-xl" href="/hn/new">New</a>
  <a class="btn btn-ghost text-xl" href="/hn/best">Best</a>
  <a class="btn btn-ghost text-xl" href="/hn/ask">Ask</a>
  <a class="btn btn-ghost text-xl" href="/hn/show">Show</a>
  <a class="btn btn-ghost text-xl" href="/hn/jobs">Jobs</a>
</div>

<slot />
