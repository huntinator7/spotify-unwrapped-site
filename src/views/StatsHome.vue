<template>
  <h1>Your Play History</h1>
  <main v-if="!user" class="content">
    <Login />
  </main>
  <main v-else-if="!userInfo" class="content">
    <span>Loading...</span>
  </main>
  <main v-else-if="!userInfo?.refresh_token" class="content">
    <SpotifyLink />
  </main>
  <main v-else-if="!playsWithStats" class="content">
    <span>Loading...</span>
  </main>
  <main v-else-if="playsWithStats.length" class="content">
    <div class="playlist">
      <div class="sticky">
        <div class="track ul">
          <span></span>
          <span>Title</span>
          <span>Artist</span>
          <span>Played At</span>
        </div>
      </div>
      <div v-for="play in playsWithStats" :key="play.id" class="track">
        <img
          :src="play.track.album.images[2].url"
          :height="imgHeight"
          :width="imgHeight"
        />
        <span>{{ play.track.name }}</span>
        <span>{{ play.track.artists[0].name }}</span>
        <span>{{ play.stats.playedAtFormatted }}</span>
      </div>
    </div>
  </main>
  <main v-else class="content">No Listens</main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { storeToRefs } from "pinia";

import { usePlayStore } from "@/stores/plays";
import Login from "@/components/LoginButton.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
import { getUserInfo } from "@/scripts/firebase";
import { useCurrentUser } from "vuefire";
import { useMedia } from "@/scripts/media";
import { computed } from "vue";
import type { User } from "@/types";

const isMobile = useMedia("(max-width: 1024px)");
const user = useCurrentUser();
const playStore = usePlayStore();
const { playsWithStats } = storeToRefs(playStore);

const userInfo: Ref<User | null> = ref(null);

onMounted(async () => {
  await playStore.getPlays();
  if (user.value) {
    userInfo.value = await getUserInfo(user);
  }
});

watch(user, async () => {
  if (user.value) {
    userInfo.value = await getUserInfo(user);
    await playStore.getPlays();
  }
});

const imgHeight = computed(() => (isMobile.value ? "32" : "64"));
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
  text-align: left;
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

@media (max-width: 1024px) {
  .track {
    grid-template-columns: 32px 30vw 1fr 30vw;
  }

  .track span {
    font-size: 1rem;
  }
}
</style>
