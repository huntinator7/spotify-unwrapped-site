<template>
  <h1>Welcome to Unwrapped!</h1>
  <main class="content">
    <span class="large"
      >Unwrapped January is here! Make sure to go
      <router-link to="/unwrapped">check it out!</router-link></span
    >
    <Login />
  </main>
</template>

<script setup lang="ts">
import Login from "@/components/LoginButton.vue";
</script>

<style scoped lang="scss">
.large {
  font-size: 2em;
}
</style>
