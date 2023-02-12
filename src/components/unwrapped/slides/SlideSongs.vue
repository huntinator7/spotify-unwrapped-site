<template>
  <div
    class="card grid"
    :style="`
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.65),
          rgba(0, 0, 0, 0.65)
        ),
        url('${month.most_listened_song.album.images[0].url}');`"
  >
    <h1>Songs</h1>
    <div class="card-section">
      <h2>You heard</h2>
      <div class="card-large">{{ month.total_songs }}</div>
      <h2>unique songs pass through your ears</h2>
    </div>
    <div class="card-section">
      <h2>The song you listened to most was</h2>
      <div class="card-large">{{ month.most_listened_song.name }}</div>
      <h2 class="card-artist">
        by
        {{ month.most_listened_song.artists.map((a) => a.name).join(", ") }}
      </h2>
    </div>
    <div class="card-section">
      <h2>which you played</h2>
      <div class="card-large">{{ month.most_listened_song.listen_count }}x</div>
      <h2>
        in
        {{ selectedMonth.month_name }} alone!
      </h2>
    </div>
    <h2 class="card-small">You really should branch out...</h2>
  </div>
</template>

<script setup lang="ts">
import type { AvailableMonth, Month } from "@/types";

defineProps<{
  selectedMonth: AvailableMonth;
  month: Month;
}>();
</script>
