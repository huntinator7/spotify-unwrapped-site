import { ref, watch, type Ref } from "vue";
import { defineStore } from "pinia";
import type { PlayItem, SessionDisplay, SessionItem } from "@/types";
import { getDoc, QueryDocumentSnapshot } from "firebase/firestore";
import { createSessionsDisplay } from "@/scripts/helpers/sessions";
import { cleanRef } from "@/scripts/firebase";
import { getStoreItemInternalPaginated } from "@/scripts/helpers/store";

export const useSessionStore = defineStore("sessions", () => {
  const sessionsSnapshot: Ref<QueryDocumentSnapshot<SessionItem>[] | null> =
    ref(null);

  const sessionsList: Ref<SessionDisplay[] | null> = ref([]);

  watch(
    sessionsSnapshot,
    (newVal) => {
      console.log("watch sessions", newVal);
      const tempSessions =
        sessionsSnapshot.value?.map((d) => ({
          ...d.data(),
          id: d.id,
        })) ?? null;
      if (!tempSessions) return null;
      sessionsList.value = createSessionsDisplay(tempSessions);
    },
    { immediate: true }
  );

  async function getSessionsInternal() {
    const newSnapshot = await getStoreItemInternalPaginated<SessionItem>(
      sessionsSnapshot,
      20,
      "Sessions",
      ["start_time", "desc"]
    );
    sessionsSnapshot.value = newSnapshot;
  }

  async function getSessions() {
    if (sessionsSnapshot.value) {
      return;
    } else {
      getSessionsInternal();
    }
  }

  async function refreshSessions() {
    sessionsSnapshot.value = [];
    await getSessionsInternal();
  }

  async function getMoreSessions() {
    await getSessionsInternal();
  }

  async function getPlaysForSession(sessionId: string) {
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
      console.log("already has plays session");
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
    sessionsList,
    getSessions,
    refreshSessions,
    getMoreSessions,
    getPlaysForSession,
  };
});
