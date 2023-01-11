import { defineStore, storeToRefs } from "pinia";
import { ref, type Ref } from "vue";
import type { Song } from "@/types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useUserStore } from "./user";

export const useSongsStore = defineStore("songs", () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const mostListenedSongs: Ref<QueryDocumentSnapshot<Song>[] | null> =
    ref(null);

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
      mostListenedSongs.value = [
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

  return {
    mostListenedSongs,
    getMostListenedSongs,
    refreshMostListenedSongs,
    getMoreMostListenedSongs,
  };
});
