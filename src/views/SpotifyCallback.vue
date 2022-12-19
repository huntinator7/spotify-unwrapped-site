<template>
  <main class="content">
    <span v-if="linkRes.loading">Loading...</span>
    <span v-else>{{ linkRes.message }}</span>
    <router-link v-if="linkRes.success" class="button primary" to="/stats"
      >View Stats</router-link
    >
  </main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { onMounted, ref } from "vue";
import { redirectUri } from "@/spotify";
import { getUserInfo } from "@/scripts/firebase";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const db = useFirestore();
const route = useRoute();
console.log(route.query.code, user, user?.value?.uid);

const linkRes = ref({
  loading: true,
  success: false,
  message: "",
});

onMounted(async () => {
  console.log(user?.value?.uid);
  if (!user?.value?.uid) {
    linkRes.value = {
      success: false,
      loading: false,
      message:
        "Error: No user found. Make sure you log in before linking your account",
    };
    return;
  }
  if (!route.query.code) {
    linkRes.value = {
      success: false,
      loading: false,
      message: "Error: No authorization code found",
    };
    return;
  }
  const userInfo = await getUserInfo(user);

  if (route.query.state !== userInfo.spotify_state) {
    linkRes.value = {
      success: false,
      loading: false,
      message: "Error: State did not match expected value",
    };
    return;
  }
  const userRef = doc(db, "User", user?.value?.uid || "");

  await updateDoc(userRef, {
    auth_code: route.query.code,
    redirect_uri: redirectUri,
  });
  linkRes.value = {
    success: true,
    loading: false,
    message: "Success! Your Spotify account has been linked!",
  };
});
</script>
