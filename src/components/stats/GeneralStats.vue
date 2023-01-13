<template>
  <h1>General Stats</h1>
  <template v-if="userInfo">
    <div class="general-stat">
      <h2>Total Minutes Listened</h2>
      <h1>{{ Math.round(userInfo.total_listen_time_ms / 60000) }}</h1>
    </div>
    <div class="general-stat">
      <h2>Total Songs Played</h2>
      <h1>{{ userInfo.total_plays }}</h1>
    </div>
    <div class="general-stat">
      <h2>Most Listened Songs</h2>
      <template v-for="song in mostListenedSongs" :key="song.id">
        <div class="song">
          <img :src="song.album.images[2].url" width="64" />
          <div class="name-artist">
            <span class="song-name">{{ song.name }}</span>
            <span class="artist-name">{{ song.artists[0].name }}</span>
          </div>
          <span class="listen-count">x{{ song.listen_count }}</span>
          <button
            class="button alt"
            :disabled="loadingSongs[song.id]"
            @click="toggleSongPlays(song.id)"
          >
            {{ showPlays[song.id] ? "Hide Plays" : "View Plays" }}
          </button>
        </div>
        <div v-if="showPlays[song.id]" class="plays">
          <div v-for="play in song.plays" :key="play.id">
            {{ formatPlayedAt(play.played_at) }}
          </div>
        </div>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useSongsStore } from "@/stores/songs";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref, type Ref } from "vue";
const userStore = useUserStore();

const { userInfo } = storeToRefs(userStore);

const songsStore = useSongsStore();

const { mostListenedSongs } = storeToRefs(songsStore);

onMounted(async () => {
  await songsStore.getMostListenedSongs();
});

const loadingSongs: Ref<Record<string, boolean>> = ref({});
const showPlays: Ref<Record<string, boolean>> = ref({});

async function toggleSongPlays(songId: string) {
  if (!mostListenedSongs.value) return;
  loadingSongs.value[songId] = true;
  await songsStore.getSongListens(songId);
  showPlays.value[songId] = !showPlays.value[songId];
  loadingSongs.value[songId] = false;
}

function formatPlayedAt(playedAt: string) {
  return `${new Date(playedAt).toLocaleDateString()} ${new Date(
    playedAt
  ).toLocaleTimeString()}`;
}
</script>

<style lang="scss" scoped>
.general-stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}

.song {
  align-self: flex-start;
  display: grid;
  grid-template-columns: 64px 2fr 1fr 1fr;
  column-gap: 10px;
  width: 100%;
  margin-bottom: 1rem;
  .name-artist {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .song-name {
      font-size: 1.3rem;
    }
  }
  .listen-count {
    margin-left: 10px;
    font-size: 2rem;
    justify-self: flex-end;
  }
}
.plays {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 2rem;
}
</style>
