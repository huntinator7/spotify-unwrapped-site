<template>
  <h3>Success! Your Spotify account has been linked!</h3>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore, useCurrentUser } from "vuefire";
import { onMounted } from "vue";

const user = useCurrentUser();
const db = useFirestore();
const route = useRoute();
console.log(route.query.code, user, user?.value?.uid);

onMounted(async () => {
  console.log(user?.value?.uid);
  if (user?.value?.uid) {
    const userRef = doc(db, "User", user?.value?.uid || "");

    await updateDoc(userRef, {
      auth_code: route.query.code,
    });
  }
});
</script>
