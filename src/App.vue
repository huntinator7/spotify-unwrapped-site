<template>
  <sidebar-menu
    :ref="sidebarRef"
    :menu="menu"
    :collapsed="collapsed"
    :relative="!isMobile"
    :hideToggle="isMobile"
    :width-collapsed="isMobile ? '0px' : '65px'"
    show-child
    @update:collapsed="hasCollapsed"
    @item-click="onItemClick"
  />
  <div class="main" :style="mainStyle">
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
import { useUnwrappedStore } from "./stores/unwrapped";

const isMobile = useMedia("(max-width: 1024px)");

const collapsed = ref(true);
const sidebarRef = ref(null);

const mainStyle = computed(() => ({
  "--width": isMobile.value
    ? "100vw"
    : collapsed.value
    ? "calc(100vw - 65px)"
    : "calc(100vw - 290px)",
}));

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
    id: "stats",
    title: "My Stats",
    icon: "fa fa-bar-chart",
    child: [
      { href: "/stats", title: "General" },
      { href: "/stats/plays", title: "Plays" },
      { href: "/stats/sessions", title: "Sessions" },
    ],
  },
  {
    href: "/public",
    title: "Public Stats",
    icon: "fa fa-chart-line",
  },
  {
    href: "/account",
    title: "Account",
    icon: "fas fa-user",
  },
  {
    id: "unwrapped",
    href: "/unwrapped",
    title: "Unwrapped",
    icon: "fas fa-box-open",
  },
]);

const unwrappedStore = useUnwrappedStore();
function onItemClick(_event: any, item: any) {
  if (isMobile.value && !!item.href) {
    collapsed.value = true;
  }
  if (item.id === "stats" && !isMobile.value && collapsed.value) {
    collapsed.value = false;
  }
  if (item.id === "unwrapped") {
    unwrappedStore.clearMonth();
  }
}

function hasCollapsed(c: boolean) {
  collapsed.value = c;
}
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
  max-width: var(--width);
  -webkit-transition: max-width 0.3s ease;
  transition: max-width 0.3s ease;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
