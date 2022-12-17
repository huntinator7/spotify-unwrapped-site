<template>
  <h1>Your Play History</h1>
  <main class="content">
    <Login v-if="!user" />
    <span v-else-if="!userInfo">Loading...</span>
    <SpotifyLink v-else-if="!userInfo?.refresh_token" />
    <span v-else-if="!playsDisplay">Loading...</span>
    <template v-else-if="playsDisplay.length">
      <div>Last Updated at {{ userLastUpdated }}</div>
      <div class="playlist">
        <div class="sticky category">
          <div class="track ul">
            <span></span>
            <span>Title</span>
            <span>Artist</span>
            <span>Played At</span>
          </div>
        </div>
        <template v-for="play in playsDisplay" :key="play.id">
          <div v-if="typeof play === 'string'" class="sticky day">
            <h1>DAY {{ play }}</h1>
          </div>
          <div v-else class="track">
            <img
              :src="play.track.album.images[2].url"
              :height="imgHeight"
              :width="imgHeight"
            />
            <span>{{ play.track.name }}</span>
            <span>{{ play.track.artists[0].name }}</span>
            <span>{{ play.stats.playedAtFormatted }}</span>
          </div>
        </template>
        <button
          class="button secondary fullwidth"
          @click="playStore.getMorePlays()"
        >
          See 20 more
        </button>
      </div>
    </template>
    <template v-else>
      <div>History Empty</div>
      <div>
        If you just linked your account, it will take approximately 2 minutes to
        get your last few days of listening
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, type Ref } from "vue";
import { useCurrentUser } from "vuefire";
import { storeToRefs } from "pinia";

import { usePlayStore } from "@/stores/plays";
import Login from "@/components/LoginButton.vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
import { getUserInfo } from "@/scripts/firebase";
import { useMedia } from "@/scripts/media";
import type { Track, User } from "@/types";

const isMobile = useMedia("(max-width: 1024px)");
const user = useCurrentUser();
const playStore = usePlayStore();
const { playsWithStats } = storeToRefs(playStore);

const userInfo: Ref<User | null> = ref(null);
const userLastUpdated: Ref<string | null> = ref(null);

const playsDisplay = computed(() => {
  let playsTemp: (Track | string)[] = [];
  if (!playsWithStats.value) return null;
  for (const [i, play] of playsWithStats.value.entries()) {
    const date = new Date(play.played_at);
    if (
      !playsWithStats.value[i - 1] ||
      new Date(playsWithStats.value[i - 1].played_at).getDay() !== date.getDay()
    ) {
      playsTemp.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    playsTemp.push(play);
  }
  return playsTemp;
});

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

watch(userInfo, (newVal) => {
  if (newVal?.last_updated) {
    userLastUpdated.value = new Date(newVal.last_updated).toLocaleString();
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
  padding-top: 1rem;
  overflow-y: auto;
  max-height: fit-content;
}

.sticky {
  position: sticky;
  background-color: var(--color-background);
  z-index: 100;
  padding-bottom: 1rem;
}
.sticky.category {
  top: calc(2.2rem);
  z-index: 101;
}

.sticky.day {
  padding-top: 4rem;
  margin-bottom: 1rem;
  top: -5rem;
}

.ul {
  border-bottom: 1px solid #ffffff30;
}

.fullwidth {
  width: -webkit-fill-available;
  width: -moz-available;
  margin-right: 2rem;
  font-size: 2em;
  margin-bottom: 1rem;
  justify-content: center;
}

@media (max-width: 1024px) {
  .track {
    grid-template-columns: 32px 30vw 1fr 30vw;
  }

  .track span {
    font-size: 1rem;
  }

  .fullwidth {
    margin-right: 0;
  }
}
</style>
