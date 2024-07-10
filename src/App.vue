<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useServiceWorkerStore } from "@/stores/serviceWorker";

const store = useServiceWorkerStore();
const router = useRouter();
store.init().then(() => router.push("/"));
</script>

<template>
  <header>
    <h1>Ctrl + C</h1>
    <h2>Clipboard Helper</h2>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/setting">Setting</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped lang="scss">
header {
  line-height: 1.2;

  h1,
  h2 {
    text-align: center
  }

  h2 {
    font-weight: 700;
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
