import type { AvailableMonth, Month, Song } from "@/types";
import {
  doc,
  getDoc,
  type QuerySnapshot,
  type QueryDocumentSnapshot,
  getDocs,
  collection,
} from "firebase/firestore";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { useFirestore } from "vuefire";
import { useUserStore } from "./user";

export const useUnwrappedStore = defineStore("unwrapped", () => {
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

  const monthSnapshot: Ref<QueryDocumentSnapshot<Month> | null> = ref(null);
  const month: ComputedRef<Month | null> = computed(() => {
    if (!monthSnapshot.value) {
      return null;
    }
    return monthSnapshot.value.data();
  });

  const topSongsSnapshot: Ref<QueryDocumentSnapshot<Song>[] | null> = ref(null);
  const topSongs: ComputedRef<Song[] | null> = computed(() => {
    if (!topSongsSnapshot.value) {
      return null;
    }
    return topSongsSnapshot.value.map((v) => v.data());
  });

  const selectedMonth: Ref<AvailableMonth | null> = ref(null);
  const availableMonths: ComputedRef<AvailableMonth[]> = computed(
    () => userInfo.value?.available_months || []
  );
  watch(selectedMonth, (newVal) => {
    if (newVal) {
      getMonth(newVal.collection);
    }
  });

  async function getMonthInternal(monthToGet: string) {
    if (!userInfo.value) {
      console.error("No user found");
      return;
    }
    const db = useFirestore();
    const res = (await getDoc(
      doc(db, "User", userInfo.value.id, "Months", monthToGet)
    )) as QueryDocumentSnapshot<Month>;
    console.log(monthSnapshot);
    console.log(res);
    monthSnapshot.value = res;
  }
  async function getMonth(monthToGet: string) {
    if (month.value) return;
    await getMonthInternal(monthToGet);
  }

  async function getTopSongsInternal(monthCollection: string) {
    if (!userInfo.value) {
      console.error("No user found");
      return;
    }
    const db = useFirestore();
    const res = (await getDocs(
      collection(
        db,
        "User",
        userInfo.value.id,
        "Months",
        monthCollection,
        "TopSongs"
      )
    )) as QuerySnapshot<Song>;
    topSongsSnapshot.value = res.docs.sort(
      (a, b) => b.data().listen_count - a.data().listen_count
    );
  }
  async function getTopSongs(monthCollection: string) {
    if (topSongs.value) return;
    await getTopSongsInternal(monthCollection);
  }

  function selectMonth(id: number) {
    console.log(availableMonths.value);
    const selected = availableMonths.value.find((month) => month.id === id);
    if (selected) {
      selectedMonth.value = selected;
      getTopSongs(selected.collection);
    }
  }

  function clearMonth() {
    selectedMonth.value = null;
  }

  return {
    month,
    topSongs,
    selectedMonth,
    availableMonths,
    getMonth,
    getTopSongs,
    selectMonth,
    clearMonth,
  };
});
