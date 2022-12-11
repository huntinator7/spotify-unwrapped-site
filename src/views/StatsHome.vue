<template>
  <h1>Your Play History</h1>
  <main v-if="!user" class="content">
    <Login />
  </main>
  <main v-else-if="!userInfo?.refresh_token" class="content">
    <SpotifyLink />
  </main>
  <main v-else-if="playsWithStats.length" class="content">
    <div class="sticky">
      <div class="track ul">
        <span></span>
        <span>Title</span>
        <span>Artist</span>
        <span>Played At</span>
      </div>
    </div>
    <div class="playlist">
      <div v-for="play in playsWithStats" :key="play.id" class="track">
        <img :src="play.track.album.images[2].url" height="64" width="64" />
        <span>{{ play.track.name }}</span>
        <span>{{ play.track.artists[0].name }}</span>
        <span>{{ play.stats.playedAtFormatted }}</span>
      </div>
    </div>
  </main>
  <main v-else class="content">No Listens</main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { usePlayStore } from "@/stores/plays";
import Login from "@/components/LoginButton.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
import { getUserInfo } from "@/scripts/firebase";
import { useCurrentUser } from "vuefire";

const user = useCurrentUser();
const playStore = usePlayStore();
const { playsWithStats } = storeToRefs(playStore);

const userInfo = await getUserInfo(user);

onMounted(async () => {
  await playStore.getPlays();
  console.log(playsWithStats);
});

console.log(playsWithStats);
</script>

<style lang="scss" scoped>
.nodec {
  list-style: none;
}
.track {
  display: grid;
  grid-template-columns: 64px 20vw 12vw 20vw;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 0;
}

.track span {
  font-size: 1.2rem;
  padding-left: 1rem;
}

.playlist {
  overflow-y: auto;
  max-height: fit-content;
}

.sticky {
  position: sticky;
  top: -1rem;
  background-color: var(--color-background);
  z-index: 100;
  padding-bottom: 1rem;
}

.ul {
  border-bottom: 1px solid #ffffff30;
}
</style>
