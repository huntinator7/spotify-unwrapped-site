<template>
  <button v-if="!user" class="button primary" @click="signIn">
    Login with Google
  </button>
  <span v-else class="logged"
    >Logged in as {{ user?.providerData?.[0]?.email }}</span
  >
</template>

<script setup lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

const auth = getAuth();

function signIn() {
  signInWithPopup(auth, provider);
}
</script>

<style lang="scss" scoped>
.logged {
  font-size: 1.2rem;
}
</style>
