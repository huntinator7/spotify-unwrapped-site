<template>
  <div class="timeline-container">
    <div class="timeline">
      <div class="day" v-for="date in dates" :key="date">
        <span>{{ date }}</span>
      </div>
      <div
        class="session-line"
        v-for="session in sessionsWithLines"
        :key="session.id"
        :style="{
          top: session.line.top,
          height: session.line.height,
        }"
      ></div>
    </div>
    <div class="session-list">
      <div class="session" v-for="session in sessions" :key="session.id">
        <div>Started {{ session.start_time }}</div>
        <div>Lasted {{ session.durationReadable }}</div>
        <div>Ended {{ session.end_time }}</div>
        <div>Number of Songs: {{ session.play_references?.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session } from "@/types";
import { computed } from "vue";

const props = defineProps<{
  sessions: Session[];
}>();

const sessionsWithLines = computed(() =>
  props.sessions.map((session) => {
    const today = new Date();
    return {
      ...session,
      line: {
        top:
          (today.valueOf() - new Date(session.end_time).valueOf()) /
            (1000 * 24 * 10) +
          "px",
        height: session.duration_ms / (1000 * 24 * 10) + "px",
      },
    };
  })
);

const dates = [
  "12/19",
  "12/18",
  "12/17",
  "12/16",
  "12/15",
  "12/14",
  "12/13",
  "12/12",
  "12/11",
  "12/10",
];
</script>

<style lang="scss" scoped>
.timeline-container {
  display: flex;
  flex-direction: row;
}
.timeline {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.day {
  border-right: 10px solid rgb(70, 70, 70);
  border-bottom: 1px solid rgb(70, 70, 70);
  height: 360px;
  padding-right: 10px;
  display: flex;
  align-items: flex-end;
}
.session-list {
  display: flex;
  flex-direction: column;
}
.session {
  padding: 2rem 0rem;
}

.session-line {
  width: 10px;
  background-color: var(--color-primary);
  position: absolute;
  left: 51px;
}
</style>
