<template>
  <h1>General Stats</h1>
  <template v-if="userInfo">
    <div class="simple-stats">
      <div class="general-stat">
        <h2>Minutes Listened</h2>
        <h1>{{ Math.round(userInfo.total_listen_time_ms / 60000) }}</h1>
      </div>
      <div class="general-stat">
        <h2>Songs Played</h2>
        <h1>{{ uniquePlayCount }}</h1>
      </div>
      <div class="general-stat">
        <h2>Unique Songs Played</h2>
        <h1>{{ uniqueSongCount }}</h1>
      </div>
      <div class="general-stat">
        <h2>Unique Albums Played</h2>
        <h1>{{ uniqueAlbumCount }}</h1>
      </div>
      <div class="general-stat">
        <h2>Unique Artists Played</h2>
        <h1>{{ uniqueArtistCount }}</h1>
      </div>
      <div class="general-stat">
        <h2>Average Minutes per Day</h2>
        <h1>{{ avgMinutesPerDay }}</h1>
      </div>
    </div>
    <div class="general-stat">
      <h2>Most Played Songs</h2>
      <template v-for="song in mostListenedSongs" :key="song.id">
        <div class="song">
          <img :src="song.album.images[2].url" width="64" />
          <div class="name-artist">
            <span class="song-name">{{ song.name }}</span>
            <span class="artist-name">{{ song.artists[0].name }}</span>
          </div>
          <div class="listens-plays">
            <span class="listen-count">x{{ song.listen_count }}</span>
            <button
              class="button alt"
              :disabled="loadingItems[song.id]"
              @click="handleSongPlays(song.id)"
            >
              {{ showPlays[song.id] ? "Hide Plays" : "View Plays" }}
            </button>
          </div>
        </div>
        <div v-if="showPlays[song.id]" class="plays">
          <div v-for="play in song.plays" :key="play.id" style="display: flex">
            <span>{{ formatPlayedAt(play.played_at) }}</span>
            <button
              class="button alt small"
              @click="showDeletePlay = play.__id!"
            >
              x
            </button>
            <div v-if="showDeletePlay === play.__id">
              <span>Are you sure you want to delete this?</span>
              <button @click="showDeletePlay = null">Cancel</button>
              <button @click="deletePlay(play.__id!, song.id)">Delete</button>
            </div>
          </div>
          <button @click="handleSongPlays(song.id, false)">Show More</button>
        </div>
      </template>
      <button
        class="button alt"
        @click="() => mostListenedStore.getMostListenedSongs()"
      >
        See More
      </button>
    </div>
    <div class="general-stat">
      <h2>Most Played Albums</h2>
      <template v-for="album in mostListenedAlbums" :key="album.id">
        <div class="song">
          <img :src="album.images[2].url" width="64" />
          <div class="name-artist">
            <span class="song-name">{{ album.name }}</span>
            <span class="artist-name">{{ album.artists[0].name }}</span>
          </div>
          <div class="listens-plays">
            <span class="listen-count">x{{ album.listen_count }}</span>
            <button
              class="button alt"
              :disabled="loadingItems[album.id]"
              @click="toggleAlbumPlays(album.id)"
            >
              {{ showPlays[album.id] ? "Hide Plays" : "View Plays" }}
            </button>
          </div>
        </div>
        <div v-if="showPlays[album.id]" class="plays">
          <div v-for="play in album.plays" :key="play.id">
            {{ `${play.name} - ${formatPlayedAt(play.played_at)}` }}
          </div>
        </div>
      </template>
      <button
        class="button alt"
        @click="() => mostListenedStore.getMostListenedAlbums()"
      >
        See More
      </button>
    </div>
    <div class="general-stat">
      <h2>Most Played Artists</h2>
      <template v-for="artist in mostListenedArtists" :key="artist.id">
        <div class="artist">
          <div class="artist-only">
            <span>{{ artist.name }}</span>
          </div>
          <div class="listens-plays">
            <span class="listen-count">x{{ artist.listen_count }}</span>
            <button
              class="button alt"
              :disabled="loadingItems[artist.id]"
              @click="toggleArtistPlays(artist.id)"
            >
              {{ showPlays[artist.id] ? "Hide Plays" : "View Plays" }}
            </button>
          </div>
        </div>
        <div v-if="showPlays[artist.id]" class="plays">
          <div v-for="play in artist.plays" :key="play.id">
            {{ `${play.name} - ${formatPlayedAt(play.played_at)}` }}
          </div>
        </div>
      </template>
      <button
        class="button alt"
        @click="() => mostListenedStore.getMostListenedArtists()"
      >
        See More
      </button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useMostListenedStore } from "@/stores/mostListened";
import { useUserStore } from "@/stores/user";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { onMounted, ref, type Ref, computed } from "vue";
import { useFirestore } from "vuefire";
const userStore = useUserStore();
const {
  user,
  userInfo,
  uniquePlayCount,
  uniqueSongCount,
  uniqueAlbumCount,
  uniqueArtistCount,
} = storeToRefs(userStore);

const mostListenedStore = useMostListenedStore();

const { mostListenedSongs, mostListenedAlbums, mostListenedArtists } =
  storeToRefs(mostListenedStore);

onMounted(async () => {
  await mostListenedStore.getMostListenedSongs();
  await mostListenedStore.getMostListenedAlbums();
  await mostListenedStore.getMostListenedArtists();
  await userStore.getCounts();
});

const loadingItems: Ref<Record<string, boolean>> = ref({});
const showPlays: Ref<Record<string, boolean>> = ref({});
const avgMinutesPerDay = computed(() => {
  if (!userInfo.value) return 0;
  const msSinceCreation =
    new Date().valueOf() - new Date(userInfo.value.created_date).valueOf();
  const daysSinceCreation = msSinceCreation / (1000 * 60 * 60 * 24);
  const listenMins = userInfo.value.total_listen_time_ms / (1000 * 60);
  console.log(listenMins, daysSinceCreation);
  return Math.round(listenMins / daysSinceCreation);
});

const togglePlays = async (
  id: string,
  call: (id: string) => Promise<void>,
  toggle = true
) => {
  loadingItems.value[id] = true;
  await call(id);
  if (toggle) {
    showPlays.value[id] = !showPlays.value[id];
  }
  loadingItems.value[id] = false;
};

const handleSongPlays = (songId: string, toggle = true) =>
  togglePlays(songId, mostListenedStore.getSongPlays, toggle);

const toggleAlbumPlays = (albumId: string) =>
  togglePlays(albumId, mostListenedStore.getAlbumPlays);

const toggleArtistPlays = (artistId: string) =>
  togglePlays(artistId, mostListenedStore.getArtistPlays);

function formatPlayedAt(playedAt: string) {
  return `${new Date(playedAt).toLocaleDateString()} ${new Date(
    playedAt
  ).toLocaleTimeString()}`;
}

const db = useFirestore();
const showDeletePlay = ref<string | null>(null);
async function deletePlay(id: string, songId: string) {
  console.log("DeleteDoc", "User", user?.value?.uid || "", "Plays", id);
  const playRef = doc(db, "User", user?.value?.uid || "", "Plays", id);
  await deleteDoc(playRef);
  const songListenRef = doc(db, "User", user?.value?.uid || "", "UserSongs");

  await updateDoc(songListenRef, {
    listens: arrayRemove(playRef),
  });
  handleSongPlays(songId, false);
}
</script>

<style lang="scss" scoped>
.simple-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2rem;
  row-gap: 2rem;
}
@media (max-width: 1024px) {
  .simple-stats {
    grid-template-columns: 1fr;
  }
}
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
  grid-template-columns: 64px 2fr 1fr;
  column-gap: 10px;
  min-width: 40vw;
  width: 100%;
  max-width: 95vw;
  margin-bottom: 1rem;
  .name-artist {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .song-name {
      font-size: 1.3rem;
    }
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
.artist {
  align-self: flex-start;
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 10px;
  min-width: 40vw;
  width: 100%;
  max-width: 95vw;
  margin-bottom: 1rem;
  .artist-only {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    span {
      font-size: 2rem;
    }
  }
}
.listens-plays {
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  justify-content: flex-end;
}
.listen-count {
  margin: 0px 10px;
  font-size: 2rem;
  justify-self: flex-end;
}
</style>
