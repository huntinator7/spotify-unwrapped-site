<template>
  <button class="button danger" @click="masquerade">
    Masquerade as test user
  </button>
  <span v-if="masqueraded">Masqueraded as: {{ masqueraded }}</span>
  <span v-else>Not Masqueraded</span>
  <button class="button danger" @click="getSessionsTest">Sessions Test</button>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { masqueraded } = storeToRefs(userStore);

function masquerade() {
  userStore.toggleMasqueraded();
}

function getSessionsTest() {
  fetch(
    "https://us-central1-spotify-unwrapped-huntinator7.cloudfunctions.net/getListensManual?key=4b53476d-131e-48de-a388-0d9551fef5f0"
  );
}
</script>
