<template>
  <h1>Unwrapped</h1>
  <main class="content">
    <div v-for="availableMonth in availableMonths" :key="availableMonth.id">
      <RouterLink
        class="unwrapped-button"
        :to="`/unwrapped/${availableMonth.id}`"
      >
        {{ availableMonth?.month_name }}
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUnwrappedStore } from "@/stores/unwrapped";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";

const unwrappedStore = useUnwrappedStore();
const { availableMonths } = storeToRefs(unwrappedStore);

onMounted(() => {
  unwrappedStore.clearMonth();
});
</script>

<style lang="scss" scoped>
.unwrapped-button {
  width: 100%;
  font-size: min(14vw, 8rem);
  border-radius: 0;
  color: var(--color-primary);
  background-color: var(--color-background);
  border: none;
  padding: 10px 20px;
  &:hover {
    cursor: pointer;
    color: var(--color-black-0);
    background-color: var(--color-primary);
  }
}
</style>
