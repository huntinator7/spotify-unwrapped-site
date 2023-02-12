<template>
  <Line :data="props.data" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  Tooltip,
} from "chart.js";
import type { ChartData } from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  Tooltip
);

const props = defineProps<{
  data: ChartData<"line">;
}>();

const chartOptions = {
  responsive: true,
  animation: {
    duration: 0,
  },
};
</script>
