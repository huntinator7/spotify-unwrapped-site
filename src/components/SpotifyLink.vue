<template>
  <label v-for="scope in possibleScopes" :key="scope.name" class="form-control">
    <input
      v-model="scopes"
      type="checkbox"
      name="checkbox"
      :id="scope.name"
      :value="scope.scope"
    />
    {{ scope.name }}
  </label>
  <button class="button primary" @click="authorize" :disabled="!scopes.length">
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
import { ref, computed } from "vue";
import { SpotifyScopeType } from "@/types";
const userStore = useUserStore();
const { user, userInfo } = storeToRefs(userStore);

const db = useFirestore();

const possibleScopes = [
  {
    name: "Recently Played",
    scope: SpotifyScopeType.RECENTLY_PLAYED,
    reason:
      "This lets us log your Spotify played songs. The site won't work very well without it!",
  },
  {
    name: "Create Playlists",
    scope: SpotifyScopeType.CREATE_PLAYLIST,
    reason: "This lets us create your Unwrapped playlists every month/season",
  },
];

const scopes = ref(userInfo.value?.spotify_scopes.split("|") || []);
const scopesParsed = computed(() =>
  scopes.value.map((s) => s.split(",")).flat()
);

async function authorize() {
  const state = uuidv4();
  await updateDoc(doc(db, "User", user?.value?.uid || ""), {
    spotify_state: state,
    spotify_scopes: scopes.value.join("|"),
  });
  const authorizeURL = spotifyApi.createAuthorizeURL(scopesParsed.value, state);
  window.location.href = authorizeURL;
}
</script>
