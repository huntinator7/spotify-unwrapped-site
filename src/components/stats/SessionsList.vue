<template>
  <span v-if="!sessionsDisplay">Loading...</span>
  <template v-else-if="sessionsDisplay.length">
    <div>Last Updated at {{ userLastUpdated }}</div>
    <Timeline :sessions="sessionsDisplay" />
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
import Timeline from "@/components/TimelineComponent.vue";

const sessionStore = useSessionStore();
const { sessionsList } = storeToRefs(sessionStore);

const sessionsDisplay = computed(() => {
  if (!sessionsList?.value) return null;
  return createSessionsDisplay(sessionsList.value);
});

const userStore = useUserStore();
const { userLastUpdated } = storeToRefs(userStore);

onMounted(() => {
  sessionStore.getSessions();
});
</script>

<style lang="scss" scoped></style>
