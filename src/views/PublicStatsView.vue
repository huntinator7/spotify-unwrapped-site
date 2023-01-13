<template>
  <h1>Charts n Stuff</h1>
  <main class="content">
    <div class="chart">
      <h2>Active Sessions</h2>
      <Line :data="data" :options="chartOptions" />
      <div class="slider">
        Days to Show
        <VueSlider
          v-if="hasNumSessions"
          v-model="chartLimits"
          :min="min"
          :max="max"
          :data="sliderData"
          data-value="value"
          data-label="key"
          :enable-cross="false"
        />
      </div>
    </div>
  </main>
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
import {
  computed,
  ref,
  onMounted,
  watch,
  type Ref,
  type ComputedRef,
} from "vue";
import { fromTimezone } from "@/scripts/helpers/publicStats";
import VueSlider from "vue-3-slider-component";
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
const hasNumSessions = computed(() => !!Object.keys(numSessions.value).length);

const min = ref(0);
const max = computed(
  () => Math.ceil(Object.keys(numSessions.value)?.length / 96) || 1
);

const chartLimits = ref([0, 1]);

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

onMounted(async () => {
  numSessionsRaw.value = (
    await getDocs(collection(db, "Aggregated", "NumSessions", "01"))
  ).docs;
});

watch(max, (newVal) => {
  chartLimits.value[0] = 0;
  chartLimits.value[1] = newVal - 1;
});
</script>

<style lang="scss">
.chart {
  max-height: 70vh;
  width: 80vw;
}
.slider {
  padding: 3rem;
}
.vue-slider-process {
  background-color: var(--color-primary) !important;
}
.vue-slider-dot-tooltip-inner {
  border-color: var(--color-primary) !important;
  background-color: var(--color-primary) !important;
  color: var(--color-black-0) !important;
}
</style>
