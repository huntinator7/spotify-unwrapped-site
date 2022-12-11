<template>
  <h1>Link Your Spotify Account</h1>
  <main class="content">
    <Login v-if="!user" />
    <a v-else class="button" :href="authorizeURL">
      Click to authorize Unwrapped to access your Spotify
    </a>
  </main>
</template>

<script setup lang="ts">
import { useCurrentUser } from "vuefire";
import { uuidv4 } from "@firebase/util";

import { spotifyApi } from "@/spotify";
import Login from "@/components/LoginButton.vue";

const user = useCurrentUser();

const scopes = ["user-read-recently-played"],
  state = uuidv4();

const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
</script>
