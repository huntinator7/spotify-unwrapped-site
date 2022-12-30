import { ref, watch, type Ref } from "vue";
import { defineStore } from "pinia";
import type { PlayItem, Session, SessionDisplay, SessionItem } from "@/types";
import {
  collection,
  getDoc,
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
import { createSessionsDisplay } from "@/scripts/helpers/sessions";
import { cleanRef } from "@/scripts/firebase";

export const useSessionStore = defineStore("sessions", () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const sessions: Ref<QueryDocumentSnapshot<SessionItem>[] | null> = ref(null);

  const sessionsList: Ref<SessionDisplay[] | null> = ref([]);

  watch(
    sessions,
    (newVal) => {
      console.log("watch sessions", newVal);
      const tempSessions =
        sessions.value?.map((d) => ({
          ...d.data(),
          id: d.id,
        })) ?? null;
      if (!tempSessions) return null;
      sessionsList.value = createSessionsDisplay(tempSessions);
    },
    { immediate: true }
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

  async function getPlaysForSession(sessionId: string) {
    console.log(sessionId);
    const index = sessionsList.value?.findIndex((s) => s.id === sessionId);
    if (!sessionsList.value) {
      console.log("no sessionsList");
      return;
    }
    if (index === undefined) {
      console.log("no index");
      return;
    }
    if (sessionsList.value[index].plays) {
      console.log("already has plays");
      return;
    }
    const plays = await Promise.all(
      sessionsList.value[index].play_references.map(async (pr) => {
        return (await getDoc(cleanRef(pr))).data() as PlayItem;
      })
    );
    sessionsList.value[index].plays = plays;
  }

  return {
    sessions,
    sessionsList,
    getSessions,
    refreshSessions,
    getMoreSessions,
    getPlaysForSession,
  };
});
