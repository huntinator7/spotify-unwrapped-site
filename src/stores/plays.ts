import { computed, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Track } from "@/types";
import { collection, getDocs } from "firebase/firestore";
import { useCurrentUser, useFirestore } from "vuefire";

export const usePlayStore = defineStore("plays", () => {
  const plays: Ref<Track[]> = ref([]);

  const playsWithStats: ComputedRef<Track[]> = computed(() =>
    plays.value
      .map((d) => ({
        ...d,
        stats: {
          playedAtFormatted: `${new Date(
            d.played_at
          ).toLocaleDateString()} ${new Date(
            d.played_at
          ).toLocaleTimeString()}`,
        },
      }))
      ?.sort((t1, t2) => (t1.played_at > t2.played_at ? -1 : 1))
  );

  async function getPlaysInternal() {
    const db = useFirestore();
    const user = useCurrentUser();

    if (user.value) {
      console.log("getting plays");
      plays.value = (
        await getDocs(collection(db, "User", user.value.uid || "", "Plays"))
      ).docs?.map((d) => ({ ...d.data(), id: d.id } as Track));
    }
  }

  async function getPlays() {
    if (plays.value.length) {
      return;
    } else {
      getPlaysInternal();
    }
  }

  async function refreshPlays() {
    plays.value = [];
    await getPlaysInternal();
  }

  return { plays, playsWithStats, getPlays, refreshPlays };
});
