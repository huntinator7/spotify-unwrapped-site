<template>
  <button class="button primary" @click="authorize">
    Click to authorize Unwrapped to access your Spotify
  </button>
</template>

<script setup lang="ts">
import { uuidv4 } from "@firebase/util";

import { spotifyApi } from "@/spotify";
import { doc, updateDoc } from "@firebase/firestore";
import { useFirestore } from "vuefire";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const db = useFirestore();

const scopes = ["user-read-recently-played"],
  state = uuidv4();

const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

async function authorize() {
  await updateDoc(doc(db, "User", user?.value?.uid || ""), {
    spotify_state: state,
  });
  window.location.href = authorizeURL;
}
</script>
