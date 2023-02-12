<template>
  <h1>Unwrapped</h1>
  <main class="content">
    <template v-if="!selectedMonth">
      <div v-for="availableMonth in availableMonths" :key="availableMonth.id">
        <button
          class="unwrapped-button"
          @click="selectMonth(availableMonth.id)"
        >
          {{ availableMonth?.month_name }}
        </button>
      </div>
    </template>
    <UnwrappedPresentation v-else />
  </main>
</template>

<script setup lang="ts">
import UnwrappedPresentation from "@/components/unwrapped/UnwrappedPresentation.vue";
import { useUnwrappedStore } from "@/stores/unwrapped";
import { storeToRefs } from "pinia";
// import { onUnmounted } from "vue";

const unwrappedStore = useUnwrappedStore();
const { selectedMonth, availableMonths } = storeToRefs(unwrappedStore);

async function selectMonth(id: number) {
  unwrappedStore.selectMonth(id);
}

// onUnmounted(() => {
//   console.log("unmounting");
//   unwrappedStore.clearMonth();
// });
</script>

<style lang="scss" scoped>
.unwrapped-button {
  width: 80vw;
  font-size: min(14vw, 8rem);
  border-radius: 1em;
  color: var(--color-primary);
  background-color: var(--color-background);
  border: 3px solid var(--color-primary);
  &:hover {
    cursor: pointer;
    color: var(--color-black-0);
    background-color: var(--color-primary);
  }
}
</style>
