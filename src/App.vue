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
import { RouterView } from "vue-router";
import imgUrl from "@/assets/logo64.png";
import { ref, type ComputedRef } from "vue";
import { computed } from "vue";
import { useMedia } from "@/scripts/media";

const isMobile = useMedia("(max-width: 1024px)");

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
    href: "/account",
    title: "Account",
    icon: "fas fa-user",
  },
]);
function onItemClick() {
  if (isMobile) {
    collapsed.value = true;
  }
}
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
}
</style>
