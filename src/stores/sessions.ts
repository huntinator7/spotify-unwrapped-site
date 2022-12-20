import { computed, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Session, SessionItem } from "@/types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

export const useSessionStore = defineStore("sessions", () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const sessions: Ref<QueryDocumentSnapshot<SessionItem>[] | null> = ref(null);

  const sessionsList: ComputedRef<Session[] | null> = computed(
    () =>
      sessions.value?.map((d) => ({
        ...d.data(),
        id: d.id,
      })) ?? null
  );

  async function getSessionsInternal() {
    const db = useFirestore();

    if (user.value) {
      console.log("getting sessions");
      const page = sessions.value?.at(-1);
      const qConstraints = [
        orderBy("start_time", "desc"),
        limit(20),
        ...(page ? [startAfter(page)] : []),
      ];
      const q = query(
        collection(db, "User", user.value.uid ?? "", "Sessions"),
        ...qConstraints
      );
      const res = await getDocs(q);
      sessions.value = [
        ...(sessions.value ?? []),
        ...res.docs,
      ] as QueryDocumentSnapshot<Session>[];
    }
  }

  async function getSessions() {
    if (sessions.value) {
      return;
    } else {
      getSessionsInternal();
    }
  }

  async function refreshSessions() {
    sessions.value = [];
    await getSessionsInternal();
  }

  async function getMoreSessions() {
    await getSessionsInternal();
  }

  return {
    sessions,
    sessionsList,
    getSessions,
    refreshSessions,
    getMoreSessions,
  };
});
