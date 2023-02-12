<template>
  <div
    class="card grid"
    :style="`
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.65),
          rgba(0, 0, 0, 0.65)
        ),
        url('${month.most_listened_artist.images[0].url}');`"
  >
    <h1>Artists</h1>
    <div class="card-section">
      <h2>You made the rounds, and gave</h2>
      <div class="card-large">{{ month.total_artists }}</div>
      <h2>artists a minute of your time</h2>
    </div>
    <div class="card-section">
      <h2>But the artist you seemed to like most was</h2>
      <div class="card-large">
        {{ month.most_listened_artist.name }}
      </div>
      <h2></h2>
    </div>
    <div class="card-section">
      <h2>whose songs you played</h2>
      <div class="card-large">
        {{ month.most_listened_artist.listen_count }}x
      </div>
      <h2></h2>
    </div>
    <h2 class="card-small">I bet you're their biggest fan</h2>
  </div>
</template>

<script setup lang="ts">
import type { Month } from "@/types";

defineProps<{
  month: Month;
}>();
</script>
