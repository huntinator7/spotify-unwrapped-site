<template>
  <div
    class="card grid"
    :style="`
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.65),
          rgba(0, 0, 0, 0.65)
        ),
        url('${month.most_listened_album.images[0].url}');`"
  >
    <h1>Albums</h1>
    <div class="card-section">
      <h2>
        If this was {{ selectedMonth?.month_name }} 1978, you would have
        collected
      </h2>
      <div class="card-large">{{ month.total_albums }}</div>
      <h2>vinyls, one for each album you listened to</h2>
    </div>
    <div class="card-section">
      <h2>But you probably would have had to replace</h2>
      <div class="card-large">
        {{ month.most_listened_album.name }}
      </div>
      <h2></h2>
    </div>
    <div class="card-section">
      <h2>because you played at least</h2>
      <div class="card-large">
        {{ month.most_listened_album.listen_count }}x
      </div>
      <h2>songs off of that one</h2>
    </div>
    <h2 class="card-small">I bet you actually have vinyls, you nerd</h2>
  </div>
</template>

<script setup lang="ts">
import type { AvailableMonth, Month } from "@/types";

defineProps<{
  selectedMonth: AvailableMonth;
  month: Month;
}>();
</script>
