<template>
  <h1>Welcome to Unwrapped!</h1>
  <main class="content">
    <span
      >Thanks for stopping by. I don't know what to put on this page, so go log
      in and see your <router-link to="/stats">stats</router-link></span
    >
    <Login />
  </main>
</template>

<script setup lang="ts">
import Login from "@/components/LoginButton.vue";
</script>
