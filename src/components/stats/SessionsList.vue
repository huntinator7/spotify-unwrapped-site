<template>
  <span v-if="!sessionsList">Loading...</span>
  <template v-else-if="sessionsList.length">
    <div>Last Updated at {{ userLastUpdated }}</div>
    <Timeline />
    <button
      class="button primary bottom"
      @click="sessionStore.getMoreSessions()"
    >
      See Previous Sessions
    </button>
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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useSessionStore } from "@/stores/sessions";
import { useUserStore } from "@/stores/user";
import Timeline from "@/components/TimelineComponent.vue";

const sessionStore = useSessionStore();
const { sessionsList } = storeToRefs(sessionStore);

const userStore = useUserStore();
const { userLastUpdated } = storeToRefs(userStore);

onMounted(() => {
  sessionStore.getSessions();
});
</script>

<style lang="scss" scoped>
.button.bottom {
  margin: 2rem 0rem;
}
</style>
