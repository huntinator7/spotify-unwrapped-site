<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/stats">Stats</RouterLink>
    <a @click="auth.signOut()">Logout</a>
  </nav>
  <Suspense>
    <template #default>
      <RouterView></RouterView>
    </template>
    <template #fallback>Loading...</template>
  </Suspense>
</template>

<script setup lang="ts">
import { getAuth } from "@firebase/auth";
import { RouterLink, RouterView } from "vue-router";

const auth = getAuth();
</script>

<style scoped lang="scss">
nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
  cursor: auto;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  &:hover {
    cursor: pointer;
  }
}

nav a:first-of-type {
  border: 0;
}

@media (max-width: 1024px) {
  nav {
    text-align: center;
    font-size: 1.5rem;
    padding: 1rem 0;
  }
}
</style>
