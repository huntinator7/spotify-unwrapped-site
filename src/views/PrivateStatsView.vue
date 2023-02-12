<template>
  <h1>Your Play History</h1>
  <main class="content">
    <Login v-if="!user" />
    <span v-else-if="!userInfo">Loading...</span>
    <SpotifyLink v-else-if="!hasSpotify" />
    <template v-else>
      <div v-if="!isMobile" class="links">
        <router-link class="button primary" to="/stats">General</router-link>
        <router-link class="button primary" to="/stats/plays"
          >Plays</router-link
        >
        <router-link class="button primary" to="/stats/sessions"
          >Sessions</router-link
        >
      </div>
      <router-view></router-view>
    </template>
  </main>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";

import Login from "@/components/LoginButton.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";

import { useUserStore } from "@/stores/user";
import { useMedia } from "@/scripts/media";

const userStore = useUserStore();

const { user, hasSpotify, userInfo } = storeToRefs(userStore);

const isMobile = useMedia("(max-width: 1024px)");

watch(userInfo, (newVal) => {
  console.log(newVal);
});
</script>

<style lang="scss" scoped>
.links {
  display: flex;
  justify-content: center;
  a {
    font-size: 1.2rem;
    margin: 0rem 1rem;
  }
}
</style>
