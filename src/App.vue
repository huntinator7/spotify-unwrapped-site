<template>
  <sidebar-menu
    :menu="menu"
    :collapsed="collapsed"
    :relative="!isMobile"
    :hideToggle="isMobile"
    :width-collapsed="isMobile ? '0px' : '65px'"
    @item-click="onItemClick"
  />
  <div class="main">
    <Suspense>
      <template #default>
        <RouterView></RouterView>
      </template>
      <template #fallback>Loading...</template>
    </Suspense>
  </div>
  <button v-if="isMobile" class="fab" @click="collapsed = !collapsed">
    <i class="fa fa-compass"></i>
  </button>
</template>

<script setup lang="ts">
import { getAuth } from "@firebase/auth";
import { RouterView } from "vue-router";
import imgUrl from "@/assets/logo64.png";
import { ref, type ComputedRef } from "vue";
import { computed } from "vue";
import { useMedia } from "@/scripts/media";

const auth = getAuth();

const isMobile = useMedia("(max-width: 1024px)");

auth.onAuthStateChanged((t) => {
  console.log("auth changed", t);
  showLogout.value = !!auth.currentUser;
});

const showLogout = ref(!!auth.currentUser);
const collapsed = ref(true);

const menu: ComputedRef<any[]> = computed(() => [
  {
    href: "/",
    title: "Home",
    icon: {
      element: "img",
      attributes: {
        src: imgUrl,
      },
    },
  },
  {
    href: "/stats",
    title: "Stats",
    icon: "fa fa-bar-chart",
  },
  {
    title: "Account",
    icon: "fas fa-user",
    ...(showLogout.value
      ? {
          child: [
            {
              title: "Logout",
              icon: "fas fa-circle-left",
            },
          ],
        }
      : {}),
  },
]);

function onItemClick(_event: any, item: any) {
  if (item.title === "Logout") {
    auth.signOut();
  }
}

console.log(isMobile.value);
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
}
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  height: 65px;
  width: 65px;
  border-radius: 65px;
  background-color: #1ed760;
  color: #191414;
  i {
    font-size: 2rem;
  }
}
</style>
