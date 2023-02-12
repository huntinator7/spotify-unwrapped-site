<template>
  <h1>Charts n Stuff</h1>
  <main class="content">
    <div class="chart">
      <div style="display: flex; align-items: center; flex-wrap: wrap">
        <h2 style="margin-right: 0.5rem">All Active Sessions for</h2>
        <select v-model="statsMonth" class="input">
          <option
            v-for="option in statsMonthOptions"
            :key="option.value"
            :value="option"
          >
            {{ option.name }}
          </option>
        </select>
        <select
          v-if="isMobile"
          v-model="statsDay"
          class="input"
          style="margin-left: 0.5rem; min-width: 2rem"
        >
          <option
            v-for="option in statsDayOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <SessionsChart :data="data" />
      <div v-if="isMobile"></div>
      <div v-else class="slider">
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
import {
  fromTimezone,
  numTo2Digit,
  monthNames,
  getDaysInMonth,
} from "@/scripts/helpers/publicStats";
import VueSlider from "vue-slider-component";
import { useMedia } from "@/scripts/media";
import SessionsChart from "@/components/stats/SessionsChart.vue";
const db = useFirestore();

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
  numSessionsRaw.value.map((n, i) => ({
    value: i,
    key: Number.parseInt(n.id.substring(3)),
  }))
);

const TIMEZONE_OFFSET = new Date().getTimezoneOffset() / 15;
const CURRENT_MONTH = new Date().getMonth();
const PREVIOUS_DAY = Math.max(new Date().getDate() - 1, 1);

const data = computed(() => {
  return {
    labels: Object.keys(numSessions.value).slice(
      chartLimits.value[0] * 96 + TIMEZONE_OFFSET,
      chartLimits.value[1] * 96 + 96 + TIMEZONE_OFFSET
    ),
    datasets: [
      {
        label: "Total Users Listening",
        data: Object.values(numSessions.value).slice(
          chartLimits.value[0] * 96 + TIMEZONE_OFFSET,
          chartLimits.value[1] * 96 + 96 + TIMEZONE_OFFSET
        ),
        borderColor: "hsl(141, 76%, 48%)",
      },
    ],
  };
});

const statsMonth = ref({
  name: monthNames[CURRENT_MONTH],
  value: CURRENT_MONTH,
});
const statsMonthOptions = Array.from(
  { length: CURRENT_MONTH + 1 },
  (_v, i) => ({ name: monthNames[i], value: i })
);
watch(statsMonth, () => {
  getData();
  if (isMobile.value) {
    statsDay.value = 1;
  }
});

const statsDay = ref(PREVIOUS_DAY);
const statsDayOptions = computed(() =>
  Array.from(
    {
      length:
        statsMonth.value.value === CURRENT_MONTH
          ? PREVIOUS_DAY
          : getDaysInMonth(`2023-${numTo2Digit(statsMonth.value.value + 1)}`),
    },
    (_v, i) => i + 1
  )
);
watch(statsDay, (newVal) => {
  console.log("statsDay", newVal);
  if (isMobile.value) {
    chartLimits.value = [newVal - 1, newVal - 1];
  }
});

async function getData() {
  numSessionsRaw.value = (
    await getDocs(
      collection(
        db,
        "Aggregated",
        "NumSessions",
        numTo2Digit(statsMonth.value.value + 1)
      )
    )
  ).docs;
}

onMounted(async () => {
  await getData();
});

watch(max, (newVal) => {
  console.log(newVal, isMobile.value);
  if (!isMobile.value) {
    chartLimits.value = [0, newVal - 1];
  } else {
    console.log(PREVIOUS_DAY);
    chartLimits.value = [
      Math.max(PREVIOUS_DAY - 1, 1),
      Math.max(PREVIOUS_DAY - 1, 1),
    ];
  }
});

const isMobile = useMedia("(max-width: 1024px)");
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
