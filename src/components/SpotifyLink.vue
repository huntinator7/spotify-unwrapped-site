<template>
  <a class="button primary" :href="authorizeURL">
    Click to authorize Unwrapped to access your Spotify
  </a>
</template>

<script setup lang="ts">
import { uuidv4 } from "@firebase/util";

import { spotifyApi } from "@/spotify";

const scopes = ["user-read-recently-played"],
  state = uuidv4();

const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
</script>
