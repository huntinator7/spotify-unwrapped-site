<template>
  <div
    class="card"
    :style="`
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.75),
          rgba(0, 0, 0, 0.75)
        ),
        url('https://playliststreams.com/wp-content/uploads/2020/04/abstract-spotify-desktop-wallpaper-62370-64314-hd-wallpapers.jpg');`"
  >
    <h1>Your {{ selectedMonth?.month_name }} Playlist</h1>
    <h2>Here are your 50 most popular songs for the month</h2>
    <button class="scroll-button" @click="prev">▲</button>
    <div class="card-playlist" ref="cardPlaylist">
      <div v-for="song in topSongs" :key="song.id" class="card-playlist-item">
        <img :src="song.album.images[2].url" width="32" height="32" />
        <span>{{ song.name }}</span>
      </div>
    </div>
    <button class="scroll-button" @click="next">▼</button>
    <h2>
      Wanna save this playlist? Click below to have Unwrapped automatically
      create this playlist for you
    </h2>
    <button
      class="button primary"
      @click="savePlaylist"
      :disabled="playlistLoading"
    >
      Save Playlist
    </button>
  </div>
</template>

<script setup lang="ts">
import { SpotifyScopeType, type AvailableMonth, type Song } from "@/types";
import { useUserStore } from "@/stores/user";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { getFunctions, httpsCallableFromURL } from "@firebase/functions";
import { storeToRefs } from "pinia";
import { ref, type VNodeRef, onMounted } from "vue";

const props = defineProps<{
  selectedMonth: AvailableMonth;
  topSongs: Song[] | null;
}>();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter();
const functions = getFunctions();

const cardPlaylist = ref<VNodeRef | undefined>(undefined);
onMounted(() => {
  console.log(cardPlaylist.value);
});
function prev() {
  const x = cardPlaylist.value as HTMLElement;
  cardPlaylist.value.scrollTop -= x.offsetHeight;
}
function next() {
  const x = cardPlaylist.value as HTMLElement;
  cardPlaylist.value.scrollTop += x.offsetHeight;
}

const playlistLoading = ref(false);
async function savePlaylist() {
  if (!userInfo.value) {
    console.error("you must be signed in");
  } else if (
    !userInfo.value.spotify_scopes.includes(SpotifyScopeType.CREATE_PLAYLIST)
  ) {
    toast(
      'You don\'t have the required permission "Create Playlists" enabled. Taking you to the account page so you can enable them',
      {
        autoClose: 2000,
        type: "warning",
      }
    );
    setTimeout(() => {
      router.push("/account");
    }, 3000);
  } else {
    const createPlaylistCall = httpsCallableFromURL<
      { month: string },
      {
        status: "success" | "error";
        message: string;
      }
    >(functions, `https://createplaylist-5idnpodiaa-uc.a.run.app`);
    try {
      playlistLoading.value = true;
      const createRes = await createPlaylistCall({
        month: props.selectedMonth.collection,
      });
      if (createRes.data.status === "error") {
        throw new Error(createRes.data.message);
      } else {
        toast(createRes.data.message, { type: "success" });
      }
    } catch (e) {
      toast(e as string, { type: "error" });
    } finally {
      playlistLoading.value = false;
    }
  }
}
</script>

<style scoped lang="scss">
.card-playlist {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(25, 32px);
  column-gap: 1rem;
  row-gap: 8px;
  height: 40vh;
  overflow-y: hidden;
  overflow-x: hidden;
}
.card-playlist-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  span {
    padding-left: 0.5rem;
    text-align: initial;
  }
}
.scroll-button {
  width: 100%;
  background-color: #fff2;
  border: none;
  height: 32px;
}
</style>
