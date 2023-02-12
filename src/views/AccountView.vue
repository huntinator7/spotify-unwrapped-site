<template>
  <h1>Account</h1>
  <main class="content">
    <Login v-if="!user || !userInfo" />
    <div class="profile" v-else>
      <div class="section">
        <h2>Account Info</h2>
        <div class="row">
          <span>Email</span>
          <span class="input">{{ user.email }}</span>
        </div>
        <div class="row">
          <span>Name</span>
          <input v-if="editName" />
          <span v-else class="input">{{ userInfo.name ?? "None" }}</span>
          <button class="button secondary" @click="notYetImplemented">
            Update
          </button>
        </div>
        <button class="button primary" @click="auth.signOut()">Logout</button>
      </div>
      <div class="section">
        <h2>Visibility</h2>
        <div class="row">
          <span
            >Your profile is {{ userInfo.public ? "Public" : "Private" }}</span
          >
          <button class="button" @click="userStore.toggleAccountPublic()">
            Set Profile to {{ userInfo.public ? "Private" : "Public" }}
          </button>
        </div>
        <span
          >This doesn't do anything yet, but once viewing other people's
          profiles is added, this will allow you to let your friends see
          yours</span
        >
      </div>
      <div class="section">
        <h2>Spotify Integration</h2>
        <SpotifyLink />
      </div>
      <div class="section">
        <h2>Delete Account</h2>
        <button class="button danger" @click="notYetImplemented">
          Delete Account
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Login from "@/components/LoginButton.vue";
import { getAuth } from "@firebase/auth";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import SpotifyLink from "@/components/SpotifyLink.vue";
const userStore = useUserStore();
const { user, userInfo } = storeToRefs(userStore);

const auth = getAuth();

const editName = ref(false);

function notYetImplemented() {
  window.alert("This functionality hasn't been added. Sry bb");
}
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 800px;
  border: 1px solid var(--color-black-1);
  padding: 1rem;
  h2 {
    margin-bottom: 1rem;
  }
  .section {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 25px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--color-black-2);
  }
  .section:last-child {
    border-bottom: 0px;
    margin-bottom: 0px;
    padding-bottom: 5px;
  }
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  span {
    font-size: 1.2rem;
  }
  > * {
    margin-right: 1rem;
  }
}

@media (max-width: 1024px) {
  .profile {
    width: 100vw;
  }
}
</style>
