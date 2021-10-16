<script setup lang="ts">
import { autoType } from "d3-dsv";
import { computed, defineProps, ref, watch } from "vue";
import { debouncedWatch } from "@vueuse/core";
import { createMessage, ws } from "../lib";

const props = defineProps({
  channel: { type: String },
  controls: { type: String },
});

const parseControls = (controlsConfig) => {
  return controlsConfig
    .split(/\n--- \s*\n/g)
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((row) => row.trim())
        .map((row) => {
          return row.split(/:\s*(.+)/).filter((r) => r);
        })
    )
    .map((chunk) => autoType(Object.fromEntries(chunk)))
    .map((chunk) => {
      return {
        title: "",
        description: "",
        value: ref(0),
        min: 0,
        max: chunk.max > chunk.min ? chunk.max : 10,
        step: 1,
        ...chunk,
        labels: chunk.labels
          ? chunk.labels.split(",").map((l) => l.trim())
          : null,
      };
    });
};

const controls = computed(() =>
  props.controls ? parseControls(props.controls) : []
);

debouncedWatch(
  controls.value.map((c) => c.value),
  (controlsValues, prevControlsValues) => {
    controlsValues.forEach((controlsValue, i) => {
      if (controlsValue !== prevControlsValues[i]) {
        const c = controls.value[i];
        const outgoingMessage = createMessage({
          channel: props.channel,
          type: c.type,
          value: controlsValue,
        });
        ws.send(outgoingMessage);
      }
    });
  },
  { deep: true, debounce: 250 }
);
</script>

<template>
  <div style="display: grid; gap: 24px; width: 100%">
    <div v-for="(c, i) in controls" :key="i">
      <div v-if="c.title">{{ c.title }}</div>
      <div style="opacity: 0.5; font-size: 0.9rem">{{ c.description }}</div>
      <input
        type="range"
        v-model.number="c.value.value"
        :min="c.min"
        :max="c.max"
        :step="c.step"
      />
      <div style="display: flex; justify-content: space-between">
        <div v-for="label in c.labels" :key="label">{{ label }}</div>
      </div>
    </div>
  </div>
</template>
