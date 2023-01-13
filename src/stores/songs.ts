import { defineStore, storeToRefs } from "pinia";
import { ref, watch, type Ref } from "vue";
import type { PlayItem, Song } from "@/types";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useUserStore } from "./user";
import { cleanRef } from "@/scripts/firebase";

export const useSongsStore = defineStore("songs", () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const mostListenedSongsSnapshot: Ref<QueryDocumentSnapshot<Song>[] | null> =
    ref(null);

  const mostListenedSongs: Ref<Song[] | null> = ref(null);

  watch(mostListenedSongsSnapshot, (newVal) => {
    if (!newVal) {
      mostListenedSongs.value = null;
      return;
    }
    mostListenedSongs.value = newVal.map((v) => v.data());
  });

  async function getMostListenedSongsInternal() {
    const db = useFirestore();

    if (user.value) {
      console.log("getting most listened songs");
      const page = mostListenedSongs.value?.at(-1);
      const qConstraints = [
        orderBy("listen_count", "desc"),
        limit(5),
        ...(page ? [startAfter(page)] : []),
      ];
      const q = query(
        collection(db, "User", user.value.uid ?? "", "UserSongs"),
        ...qConstraints
      );
      const res = await getDocs(q);
      mostListenedSongsSnapshot.value = [
        ...(mostListenedSongs.value ?? []),
        ...res.docs,
      ] as QueryDocumentSnapshot<Song>[];
    }
  }

  async function getMostListenedSongs() {
    if (mostListenedSongs.value) {
      return;
    } else {
      getMostListenedSongsInternal();
    }
  }

  async function refreshMostListenedSongs() {
    mostListenedSongs.value = [];
    await getMostListenedSongsInternal();
  }

  async function getMoreMostListenedSongs() {
    await getMostListenedSongsInternal();
  }

  async function getSongListens(songId: string) {
    if (!mostListenedSongs.value) return;
    const index = mostListenedSongs.value.findIndex((s) => s.id === songId);
    if (index === -1) return;
    if (mostListenedSongs.value[index].plays) {
      console.log("already has plays");
      return;
    }
    const song = mostListenedSongs.value[index];
    const plays = await Promise.all(
      song.listens.map(async (l) => {
        return (await getDoc(cleanRef(l))).data() as PlayItem;
      })
    );
    mostListenedSongs.value[index].plays = plays.sort((a, b) =>
      a.played_at > b.played_at ? -1 : 1
    );
  }

  return {
    mostListenedSongs,
    getMostListenedSongs,
    refreshMostListenedSongs,
    getMoreMostListenedSongs,
    getSongListens,
  };
});
