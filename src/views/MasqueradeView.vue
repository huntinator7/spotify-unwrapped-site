<template>
  <button class="button danger" @click="masquerade">
    Masquerade as test user
  </button>
  <span v-if="masqueraded">Masqueraded as: {{ masqueraded }}</span>
  <span v-else>Not Masqueraded</span>
  <div>
    <h2>Get Listens</h2>
    <span>key</span>
    <input v-model="getListensKey" />
    <button class="button danger" @click="getListensManual">Get Listens</button>
  </div>
  <div>
    <h2>Combine Sessions</h2>
    <span>key</span>
    <input v-model="combineSessionsKey" />
    <button class="button danger" @click="combineSessionsManual">
      Combine Sessions
    </button>
  </div>
  <div>
    <h2>Init Aggregated Sessions</h2>
    <span>key</span>
    <input v-model="initAggregatedSessionsKey" />
    <span>date</span>
    <input v-model="initAggregatedSessionsDate" />
    <button class="button danger" @click="initAggregatedSessions">
      Init Aggregated Sessions
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { masqueraded } = storeToRefs(userStore);

const getListensKey = ref("");
const combineSessionsKey = ref("");
const initAggregatedSessionsKey = ref("");
const initAggregatedSessionsDate = ref("");

function masquerade() {
  userStore.toggleMasqueraded();
}

function getListensManual() {
  fetch(
    `https://us-central1-spotify-unwrapped-huntinator7.cloudfunctions.net/getListensManual?key=${getListensKey.value}`
  );
}

function combineSessionsManual() {
  fetch(
    `https://us-central1-spotify-unwrapped-huntinator7.cloudfunctions.net/combineSessionsManual?key=${combineSessionsKey.value}`
  );
}

function initAggregatedSessions() {
  fetch(
    `https://us-central1-spotify-unwrapped-huntinator7.cloudfunctions.net/initAggregatedSessions?key=${initAggregatedSessionsKey.value}&date=${initAggregatedSessionsDate.value}`
  );
}
</script>
