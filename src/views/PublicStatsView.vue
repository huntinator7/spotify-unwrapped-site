<template>
  <div class="chart"><Line :data="data" :options="chartOptions" /></div>
  <div class="slider">
    Days to Show
    <vue-slider
      v-model="chartLimits"
      :min="min"
      :max="max"
      :data="sliderData"
      data-value="value"
      data-label="key"
      :enable-cross="false"
    />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  Tooltip,
} from "chart.js";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { useFirestore } from "vuefire";
import { computed, ref, type Ref, onMounted, type ComputedRef } from "vue";
import { fromTimezone } from "@/scripts/helpers/publicStats";
const db = useFirestore();

ChartJS.register(
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  Tooltip
);

const numSessionsRaw: Ref<QueryDocumentSnapshot<Record<string, number>>[]> =
  ref([]);
const numSessions: ComputedRef<Record<string, number>> = computed(() =>
  Object.fromEntries(
    numSessionsRaw.value
      .map((d) =>
        Object.entries(d.data())
          .sort(([k1], [k2]) => (k1 < k2 ? -1 : 1))
          .map(([k, v]) => [fromTimezone(d.id, k), v])
      )
      .flat(1)
  )
);

const min = ref(0);
const max = computed(() => Object.keys(numSessions.value)?.length / 96 || 18);

const chartLimits = ref([min.value, max.value]);

const sliderData = computed(() =>
  numSessionsRaw.value.map((n, i) => ({ value: i, key: n.id }))
);

const data = computed(() => {
  return {
    labels: Object.keys(numSessions.value).slice(
      chartLimits.value[0] * 96,
      chartLimits.value[1] * 96 + 96
    ),
    datasets: [
      {
        label: "Total Users Listening",
        data: Object.values(numSessions.value).slice(
          chartLimits.value[0] * 96,
          chartLimits.value[1] * 96 + 96
        ),
        borderColor: "hsl(141, 76%, 48%)",
      },
    ],
  };
});
const chartOptions = {
  responsive: true,
  animation: {
    duration: 0,
  },
};

console.log(numSessions.value);

onMounted(async () => {
  numSessionsRaw.value = (
    await getDocs(collection(db, "Aggregated", "NumSessions", "12"))
  ).docs;
});
</script>

<style lang="scss">
.chart {
  max-height: 80vh;
}
.slider {
  padding: 3rem;
}
.vue-slider-process {
  background-color: var(--color-primary);
}
.vue-slider-dot-tooltip-inner {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-black-0);
}
</style>
