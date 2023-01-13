<template>
  <button class="button danger" @click="masquerade">
    Masquerade as test user
  </button>
  <span v-if="masqueraded">Masqueraded as: {{ masqueraded }}</span>
  <span v-else>Not Masqueraded</span>
  <MasqueradeSection path="getlistensmanual" :additional-fields="[]" />
  <MasqueradeSection path="combinesessionsmanual" :additional-fields="[]" />
  <MasqueradeSection
    path="initaggregatedsessions"
    :additional-fields="['date']"
  />
  <MasqueradeSection path="populateusersongs" :additional-fields="[]" />
  <MasqueradeSection path="populatesongalbumlistens" :additional-fields="[]" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import MasqueradeSection from "@/components/MasqueradeSection.vue";

const userStore = useUserStore();
const { masqueraded } = storeToRefs(userStore);

function masquerade() {
  userStore.toggleMasqueraded();
}
</script>

<style lang="scss" scoped>
.day {
  overflow-y: auto;
  height: 300px;
}
</style>
