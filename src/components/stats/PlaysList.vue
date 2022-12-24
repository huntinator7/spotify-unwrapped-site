<template>
  <span v-if="!playsDisplay">Loading...</span>
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
      <button class="button alt fullwidth" @click="playStore.getMorePlays()">
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
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { usePlayStore } from "@/stores/plays";
import { createPlaysDisplay } from "@/scripts/helpers/plays";
import { useMedia } from "@/scripts/media";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { userLastUpdated } = storeToRefs(userStore);

const isMobile = useMedia("(max-width: 1024px)");
const imgHeight = computed(() => (isMobile.value ? "32" : "64"));

const playStore = usePlayStore();
const { playsWithStats } = storeToRefs(playStore);

const playsDisplay = computed(() => {
  if (!playsWithStats?.value) return null;
  return createPlaysDisplay(playsWithStats.value);
});

onMounted(() => {
  playStore.getPlays();
});
</script>

<style lang="scss" scoped>
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
