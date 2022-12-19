<template>
  <h1>Your Play History</h1>
  <main class="content">
    <Login v-if="!user" />
    <span v-else-if="!userInfo">Loading...</span>
    <SpotifyLink v-else-if="!hasSpotify" />
    <div v-else>
      <div>
        <router-link to="/stats/plays">Plays</router-link>
        <router-link to="/stats/sessions">Sessions</router-link>
      </div>
      <router-view></router-view>
    </div>
  </main>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useCurrentUser } from "vuefire";
import { storeToRefs } from "pinia";

import Login from "@/components/LoginButton.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";

import { useUserStore } from "@/stores/user";

const user = useCurrentUser();
const userStore = useUserStore();

const { hasSpotify, userInfo } = storeToRefs(userStore);

watch(userInfo, (newVal) => {
  console.log(newVal);
});
</script>
