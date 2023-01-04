<template>
  <h1>General Stats</h1>
  <div v-if="userInfo">
    <h2>Total Minutes Listened</h2>
    <h1>{{ Math.round(userInfo.total_listen_time_ms / 60000) }}</h1>
  </div>
  <div v-if="userInfo">
    <h2>Total Songs Played</h2>
    <h1>{{ userInfo.total_plays }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();

const { userInfo } = storeToRefs(userStore);
</script>

<style lang="scss" scoped></style>
