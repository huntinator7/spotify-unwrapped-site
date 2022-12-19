<template>
  <span v-if="!sessionsDisplay">Loading...</span>
  <template v-else-if="sessionsDisplay.length">
    <div>Last Updated at {{ userLastUpdated }}</div>
    <div class="session-list">
      <div class="session" v-for="session in sessionsDisplay" :key="session.id">
        <div>Started {{ session.start_time }}</div>
        <div>Lasted {{ session.durationReadable }}</div>
        <div>Ended {{ session.end_time }}</div>
        <div>Number of Songs: {{ session.play_references?.length }}</div>
      </div>
    </div>
  </template>
  <template v-else>
    <div>History Empty</div>
    <div>
      If you just linked your account, it will take approximately 2 minutes to
      get your last few days of listening
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useSessionStore } from "@/stores/sessions";
import { useUserStore } from "@/stores/user";
import { createSessionsDisplay } from "@/scripts/helpers/sessions";

const sessionStore = useSessionStore();
const { sessionsList } = storeToRefs(sessionStore);

const sessionsDisplay = computed(() => {
  if (!sessionsList?.value) return null;
  return createSessionsDisplay(sessionsList.value);
});

const userStore = useUserStore();
const { userLastUpdated } = storeToRefs(userStore);

onMounted(async () => {
  console.log(sessionStore, sessionStore?.getSessions);
  await sessionStore.getSessions();
});
</script>

<style lang="scss" scoped>
.session {
  margin: 2rem 0rem;
}
</style>
