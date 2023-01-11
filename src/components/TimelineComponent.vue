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
        :class="{ 'is-selected': hoverId == session.id }"
        v-for="session in sessionsList"
        :key="session.id"
        :style="{
          top: session.line.top,
          height: session.line.height,
        }"
        @click="selectHover(session.id)"
      ></div>
    </div>
    <div
      class="session"
      :class="{ 'is-selected': hoverId == session.id }"
      v-for="session in sessionsList"
      :key="session.id"
      :style="{
        top: `calc(${session.line.top} + ${session.line.height} / 2)`,
      }"
    >
      <div class="session-header">
        <button class="button transparent small" @click="hoverId = ''">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <div>Started {{ session.start_time }}</div>
      <div>Lasted {{ session.durationReadable }}</div>
      <div>Ended {{ session.end_time }}</div>
      <div>Number of Songs: {{ session.play_references?.length }}</div>
      <div
        class="session-play-list"
        v-if="session.plays && showSongs[session.id]"
      >
        <div
          class="session-play"
          v-for="play in session.plays"
          :key="play.played_at"
        >
          <img :src="play.album.image" width="32" height="32" />
          <span>{{ play.name }}</span>
        </div>
      </div>
      <button
        class="button primary"
        style="margin-top: 4px"
        :disabled="loadingSongs[session.id]"
        @click="toggleShowSongs(session)"
      >
        {{ showSongs[session.id] ? "Hide Songs" : "View Songs" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref, type ComputedRef } from "vue";
import { useSessionStore } from "@/stores/sessions";
import { storeToRefs } from "pinia";
import type { SessionDisplay } from "@/types";

const sessionStore = useSessionStore();
const { sessionsList } = storeToRefs(sessionStore);

const loadingSongs: Ref<Record<string, boolean>> = ref({});
const showSongs: Ref<Record<string, boolean>> = ref({});

const hoverId: Ref<string> = ref("");

function selectHover(id: string) {
  hoverId.value = hoverId.value === id ? "" : id;
}

const dates: ComputedRef<string[]> = computed(() => {
  if (!sessionsList.value) return [];
  const newestDate = new Date();
  const oldestDate = new Date(
    sessionsList.value.at(-1)?.start_time ?? Date.now()
  );
  const numDays =
    Math.ceil(
      (newestDate.valueOf() - oldestDate.valueOf()) / (24 * 60 * 60 * 1000)
    ) + 1;
  return Array.from({ length: numDays }, (_v, i) =>
    getDateString(new Date().setDate(new Date().getDate() - i))
  );
});

function getDateString(dateNum: number) {
  const date = new Date(dateNum);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

async function toggleShowSongs(session: SessionDisplay) {
  if (!sessionsList.value) return;
  loadingSongs.value[session.id] = true;
  await sessionStore.getPlaysForSession(session.id);
  showSongs.value[session.id] = !showSongs.value[session.id];
  loadingSongs.value[session.id] = false;
}
</script>

<style lang="scss" scoped>
.timeline-container {
  display: flex;
  flex-direction: row;
  --line-width: 50px;
  --day-width: 200px;
  --session-br: 10px;
  --session-width: 350px;
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
  min-width: var(--session-width);
  padding: 10px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  transition: opacity 0.5s ease 0.3s, visibility 0s ease 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: var(--session-br);
  border: 5px solid rgb(70, 70, 70);
  margin-top: -84px;
  opacity: 0;
  visibility: hidden;
}

.session.is-selected {
  opacity: 1;
  visibility: visible;
}

.session-line {
  width: var(--line-width);
  background-color: var(--color-text);
  position: absolute;
  left: calc(var(--day-width) - var(--line-width));
  transition: width 0.5s ease;
}
.session-line.is-selected {
  background-color: var(--color-primary);
  width: calc(var(--line-width) * 2);
}

.session-line:hover {
  cursor: pointer;
}

.session-header {
  position: absolute;
  top: 5px;
  right: 5px;
}

.session-play {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.5rem;
  span {
    padding-left: 0.5rem;
  }
}

@media (max-width: 1024px) {
  .session {
    left: calc(
      (var(--day-width) * 2 - var(--line-width) - var(--session-width)) / 2
    );
    margin-top: 20px;
  }
}
</style>
