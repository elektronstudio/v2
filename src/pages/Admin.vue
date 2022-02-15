<script setup lang="ts">
import { toRefs, computed, ref } from "vue";
import { format } from "date-fns";
import { useStorage } from "@vueuse/core";
import { messages, ws, safeJsonParse, unique } from "../lib";

const channel = "eksperiment";
const types = "DATA_1";

const captureId = ref(null);

const captured = useStorage("elektron_captured", []);

const selectedCaptureId = ref(null);

const selectedCaptures = computed(() => {
  if (selectedCaptureId.value) {
    return captured.value.filter(
      (c) => c.captureId === selectedCaptureId.value
    );
  }
  return null;
});

const formatCaptureName = (date) => format(date, "dd_MM_y__HH_mm_ss");

const onStart = () => {
  captureId.value = formatCaptureName(new Date());
};

const onEnd = () => {
  captureId.value = null;
};

const isCapture = (m) =>
  m.channel === channel &&
  types
    .split(",")
    .map((t) => t.trim())
    .includes(m.type);

const captureIds = computed(() =>
  unique(captured.value.map((c) => c.captureId)).filter((c) => {
    if (captureId.value) {
      return c !== captureId.value;
    }
    return true;
  })
);

ws.addEventListener("message", ({ data }) => {
  const message = safeJsonParse(data);
  if (isCapture(message) && captureId.value) {
    captured.value = [
      ...captured.value,
      { ...message, captureId: captureId.value },
    ];
  }
});
</script>
<template>
  <div>
    <horizontal style="--cols: 1fr 2fr">
      <vertical style="padding: 32px">
        <h3>Current capture</h3>

        <p v-if="!captureId">Capture OFF</p>
        <p v-if="captureId" style="color: red">Capture ON</p>

        <button-big v-if="!captureId" @click="onStart">
          ● Start capture
        </button-big>
        <button-big v-if="captureId" @click="onEnd">◼ Stop capture</button-big>

        <div
          v-if="captureId"
          class="captureCard"
          @click="selectedCaptureId = captureId"
          :style="{
            background: selectedCaptureId === captureId ? '#444' : '#222',
          }"
        >
          {{ captureId }}.csv
        </div>

        <h3>Previous captures</h3>

        <div
          v-for="id in captureIds"
          class="captureCard"
          :key="id"
          @click="selectedCaptureId = id"
          :style="{ background: selectedCaptureId === id ? '#444' : '#222' }"
        >
          {{ id }}.csv
        </div>
      </vertical>
      <vertical>
        <pre>{{ selectedCaptures }}</pre>
      </vertical>
    </horizontal>
    <layout>
      <template #top-left> </template>
      <template #top-right> </template>
      <template #bottom-left> </template>
    </layout>
  </div>
</template>

<style scoped>
.captureCard {
  padding: 8px 16px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8em;
  cursor: pointer;
}
</style>
