<template>
  <div class="timeline-container">
    <div class="timeline">
      <div class="day" v-for="date in dates" :key="date">
        <div class="time-marker">12:00 AM</div>
        <div class="time-marker">6:00 PM</div>
        <div class="time-marker">12:00 PM</div>
        <div class="time-marker">6:00 AM</div>
        <div class="day-marker">{{ date }}</div>
      </div>
      <div
        class="session-line"
        v-for="session in sessionsWithLines"
        :key="session.id"
        :style="{
          top: session.line.top,
          height: session.line.height,
        }"
        @mouseover="hover[session.id] = true"
        @mouseleave="hover[session.id] = false"
      ></div>
    </div>
    <div
      class="session"
      v-for="session in sessionsWithLines"
      :key="session.id"
      :style="{
        top: `calc(${session.line.top} + ${session.line.height} / 2)`,
        opacity: hover[session.id] ? 1 : 0,
        visibility: hover[session.id] ? 'visible' : 'hidden',
      }"
    >
      <div>Started {{ session.start_time }}</div>
      <div>Lasted {{ session.durationReadable }}</div>
      <div>Ended {{ session.end_time }}</div>
      <div>Number of Songs: {{ session.play_references?.length }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session } from "@/types";
import { computed, ref, type Ref } from "vue";

const props = defineProps<{
  sessions: Session[];
}>();

const hover: Ref<Record<string, boolean>> = ref({});

const sessionsWithLines = computed(() =>
  props.sessions.map((session) => {
    const today = new Date();
    const top =
      (today.valueOf() - new Date(session.end_time).valueOf()) /
        (1000 * 24 * 10) +
      "px";
    hover.value[session.id] = false;
    return {
      ...session,
      line: {
        top,
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
  --line-width: 50px;
  --day-width: 200px;
  --session-br: 10px;
  margin-right: calc(var(--day-width) - var(--line-width));
}
.timeline {
  display: flex;
  flex-direction: column;
}

.day {
  border-right: var(--line-width) solid rgb(70, 70, 70);
  border-bottom: 1px solid rgb(70, 70, 70);
  height: 360px;
  padding-right: 10px;
  display: flex;
  width: var(--day-width);
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}
.session-list {
  display: flex;
  flex-direction: column;
}
.session {
  position: absolute;
  left: calc(var(--day-width) + var(--line-width));
  min-width: 300px;
  padding: 10px;
  background-color: var(--color-light-black);
  color: var(--color-white);
  transition: opacity 0.5s ease 0.3s, visibility 0s ease 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: var(--session-br);
  border: 5px solid rgb(70, 70, 70);
  margin-top: -63px;
}

.session-line {
  width: var(--line-width);
  background-color: var(--color-white);
  position: absolute;
  left: calc(var(--day-width) - var(--line-width));
  transition: width 0.5s ease;
}
.session-line:hover {
  background-color: var(--color-primary);
  width: calc(var(--line-width) * 2);
}

@media (max-width: 1024px) {
  .session {
    left: 0px;
    margin-top: 0px;
  }
}
</style>
