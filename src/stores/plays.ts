import { computed, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Track } from "@/types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { useCurrentUser, useFirestore } from "vuefire";

export const usePlayStore = defineStore("plays", () => {
  const plays: Ref<QueryDocumentSnapshot<Track>[] | null> = ref(null);

  const playsWithStats: ComputedRef<Track[] | null> = computed(
    () =>
      plays.value?.map((d) => ({
        ...d.data(),
        id: d.id,
        stats: {
          playedAtFormatted: `${new Date(
            d.data().played_at
          ).toLocaleDateString()} ${new Date(
            d.data().played_at
          ).toLocaleTimeString()}`,
        },
      })) ?? null
  );

  async function getPlaysInternal() {
    const db = useFirestore();
    const user = useCurrentUser();

    if (user.value) {
      console.log("getting plays");
      const page = plays.value?.at(-1);
      const qConstraints = [
        orderBy("played_at", "desc"),
        limit(20),
        ...(page ? [startAfter(page)] : []),
      ];
      const q = query(
        collection(db, "User", user.value.uid, "Plays"),
        ...qConstraints
      );
      const res = await getDocs(q);
      plays.value = [
        ...(plays.value ?? []),
        ...res.docs,
      ] as QueryDocumentSnapshot<Track>[];
    }
  }

  async function getPlays() {
    if (plays.value) {
      return;
    } else {
      getPlaysInternal();
    }
  }

  async function refreshPlays() {
    plays.value = [];
    await getPlaysInternal();
  }

  async function getMorePlays() {
    await getPlaysInternal();
  }

  return { plays, playsWithStats, getPlays, refreshPlays, getMorePlays };
});
