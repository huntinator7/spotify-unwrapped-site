import { computed, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Play } from "@/types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const PAGE_SIZE = 20;

export const usePlayStore = defineStore("plays", () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const plays: Ref<QueryDocumentSnapshot<Play>[] | null> = ref(null);

  const playsWithStats: ComputedRef<Play[] | null> = computed(
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

  const searchQuery = ref("");
  const hasMorePlays = ref(true);

  async function getPlaysInternal() {
    const db = useFirestore();

    if (user.value) {
      console.log("getting plays");
      console.log(searchQuery.value);
      const page = plays.value?.at(-1);
      const qConstraints = [
        ...buildSearchQuery(),
        orderBy("played_at", "desc"),
        limit(PAGE_SIZE),
        ...(page ? [startAfter(page)] : []),
      ];
      const q = query(
        collection(db, "User", user.value.uid ?? "", "Plays"),
        ...qConstraints
      );
      const res = await getDocs(q);
      console.log(res);
      plays.value = [
        ...(plays.value ?? []),
        ...res.docs,
      ] as QueryDocumentSnapshot<Play>[];
      hasMorePlays.value = res.size === PAGE_SIZE;
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
    hasMorePlays.value = true;
    await getPlaysInternal();
  }

  async function getMorePlays() {
    await getPlaysInternal();
  }

  function buildSearchQuery() {
    if (searchQuery.value) {
      return [
        orderBy("name", "desc"),
        where("name", ">=", searchQuery.value),
        where("name", "<=", searchQuery.value + "\uf8ff"),
      ];
    }
    return [];
  }

  return {
    plays,
    playsWithStats,
    searchQuery,
    hasMorePlays,
    getPlays,
    refreshPlays,
    getMorePlays,
  };
});
