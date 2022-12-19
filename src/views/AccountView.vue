<template>
  <h1>Account</h1>
  <main class="content">
    <Login v-if="!user" />
    <div class="button-list" v-else>
      <button class="button primary" @click="auth.signOut()">Logout</button>
      <button class="button danger" @click="deleteAccount">
        Delete Account
      </button>
      <button class="button danger" @click="getSessionsTest">
        Sessions Test
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import Login from "@/components/LoginButton.vue";
import { getAuth } from "@firebase/auth";
import { useCurrentUser } from "vuefire";

const user = useCurrentUser();

const auth = getAuth();

function deleteAccount() {
  window.alert("you won't");
}

function getSessionsTest() {
  fetch(
    "https://us-central1-spotify-unwrapped-huntinator7.cloudfunctions.net/getSessionsTest"
  );
}
</script>

<style lang="scss" scoped>
.button-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin-bottom: 10px;
  }
}

.secondary-holder {
  background-color: white;
  padding: 20px;
}
</style>
