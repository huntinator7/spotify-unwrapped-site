<template>
  <div
    class="card grid"
    :style="`
              background-image: linear-gradient(
                  rgba(0, 0, 0, 0.65),
                  rgba(0, 0, 0, 0.65)
                ),
                url('https://images.pexels.com/photos/767172/pexels-photo-767172.jpeg');`"
  >
    <h1>Your {{ selectedMonth?.month_name }}, Unwrapped</h1>
    <div class="card-section">
      <h2>
        Congrats, you survived {{ selectedMonth?.month_name }}! And listened to
      </h2>
      <div class="card-large">{{ month.total_plays }}</div>
      <h2>songs along the way</h2>
    </div>
    <h2>That's a lot.</h2>
    <div class="card-section">
      <h2>In fact, it's</h2>
      <div class="card-large">
        {{ Math.round(month.total_listen_time_ms / (1000 * 60)) }}
        minutes
      </div>
      <h2>of head-banging, heart pounding music</h2>
    </div>
    <h2 class="card-small">
      That's
      {{ Math.round(month.total_listen_time_ms / (1000 * 60 * 60)) }}
      hours,
      {{ (month.total_listen_time_ms / (1000 * 60 * 60 * 24)).toPrecision(3) }}
      days, or
      {{
        (
          month.total_listen_time_ms /
          (1000 *
            60 *
            60 *
            24 *
            0.01 *
            getDaysInMonth(`2023-${selectedMonth.collection}`))
        ).toPrecision(3)
      }}% of the month
    </h2>
  </div>
</template>

<script setup lang="ts">
import { getDaysInMonth } from "@/scripts/helpers/publicStats";
import type { AvailableMonth, Month } from "@/types";

defineProps<{
  selectedMonth: AvailableMonth;
  month: Month;
}>();
</script>
