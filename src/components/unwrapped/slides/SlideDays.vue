<template>
  <div
    class="card grid"
    :style="`
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.65),
          rgba(0, 0, 0, 0.65)
        ),
        url('https://www.gannett-cdn.com/presto/2021/11/19/PNAS/cc82ca74-5e59-43cd-8877-74b42c47ee07-NAS-VINYL-008.jpg');`"
  >
    <h1>Days</h1>
    <div class="card-section">
      <h2>
        Most days are average, it's a fact of life. On those, you probably spent
      </h2>
      <div class="card-large">{{ month.avg_minutes_per_day }}</div>
      <h2>minutes listening to music</h2>
    </div>
    <div class="card-section">
      <h2>But one day stood out above the rest. On the</h2>
      <div class="card-large">
        {{ ordinalSuffixOf(parseInt(month.most_listened_day.day)) }}
      </div>
      <h2>you were absolutely jamming</h2>
    </div>
    <div class="card-section">
      <h2>You managed to squeeze</h2>
      <div class="card-large">
        {{ Math.round(month.most_listened_day.listen_time_ms / (1000 * 60)) }}
      </div>
      <h2>minutes of listening into a single day. Impressive!</h2>
    </div>
    <h2 class="card-small">
      You probably need to go outside more. Or read a book or something
    </h2>
  </div>
</template>

<script setup lang="ts">
import { ordinalSuffixOf } from "@/scripts/helpers/numbers";
import type { Month } from "@/types";

defineProps<{
  month: Month;
}>();
</script>
