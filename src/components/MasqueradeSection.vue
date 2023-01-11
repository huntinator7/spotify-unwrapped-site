<template>
  <div>
    <h2>{{ name }}</h2>
    <span>key</span>
    <input v-model="key" />
    <template v-for="field in additionalFields" :key="field.name">
      <span>{{ field.name }}</span>
      <input v-model="field.value" />
    </template>
    <button class="button danger" @click="fetchCall">{{ name }}</button>
  </div>
</template>

<script setup lang="ts">
import { getFunctions, httpsCallableFromURL } from "firebase/functions";
import { ref, computed } from "vue";
const functions = getFunctions();

const props = defineProps<{
  path: string;
  additionalFields: string[];
}>();

const name = props.path
  .split(/(?=[A-Z])/)
  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
  .join(" ");

const additionalFields = ref(
  props.additionalFields.map((f) => ({ name: f, value: "" }))
);

const functionData = computed(() =>
  additionalFields.value.reduce((a, c) => ({ ...a, [c.name]: c.value }), {})
);

const key = ref("");

async function fetchCall() {
  const cloudFunction = httpsCallableFromURL(
    functions,
    `https://${props.path}-5idnpodiaa-uc.a.run.app`
  );
  const x = await cloudFunction({
    key: key.value,
    ...functionData.value,
  });
  console.log(x);
}
</script>
