<script setup lang="ts">
import { autoType } from "d3-dsv";
import { computed, defineProps, ref, watch } from "vue";
import { debouncedWatch, useStorage } from "@vueuse/core";
import { createMessage, ws, unique } from "../lib";

const submitted = useStorage("elektron_submitted", []);

const props = defineProps({
  channel: { type: String },
  controls: { type: String },
});

const parseControls = (controlsConfig) => {
  return controlsConfig
    .split(/\n---\s*\n/g)
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
        control: chunk.control === "text" ? "text" : "slider",
        title: "",
        description: "",
        value: ref(chunk.control === "text" ? "" : 0),
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

const hasSubmit = computed(() =>
  controls.value.find((c) => c.control === "submit")
);

const isSubmitted = computed(() => submitted.value.includes(props.channel));

debouncedWatch(
  controls.value.map((c) => c.value),
  (controlsValues, prevControlsValues) => {
    controlsValues.forEach((controlsValue, i) => {
      if (controlsValue !== prevControlsValues[i]) {
        const c = controls.value[i];
        if (c.control === "slider") {
          const outgoingMessage = createMessage({
            channel: props.channel,
            type: c.type,
            value: controlsValue,
          });
          ws.send(outgoingMessage);
        }
      }
    });
  },
  { deep: true, debounce: 250 }
);

const onSubmit = (i) => {
  const c = controls.value[i];
  const outgoingMessage = createMessage({
    channel: props.channel,
    type: c.type,
    value: c.value.value,
  });
  ws.send(outgoingMessage);
};

const onFormSubmit = () => {
  const submissions = controls.value.filter(
    (c) => c.control !== "submit" && c.value.value !== ""
  );
  if (submissions.length) {
    submissions.forEach((c) => {
      const outgoingMessage = createMessage({
        channel: props.channel,
        type: c.type,
        value: c.value.value,
      });
      ws.send(outgoingMessage);
    });
    submitted.value = unique([...submitted.value, props.channel]);
  }
};
</script>

<template>
  <div style="display: grid; gap: 24px; width: 100%" v-if="!isSubmitted">
    <div v-for="(c, i) in controls" :key="i">
      <div v-if="c.title">{{ c.title }}</div>
      <div style="opacity: 0.5; font-size: 0.9rem">{{ c.description }}</div>
      <div>
        <input
          v-if="c.control !== 'submit'"
          :type="c.control === 'slider' ? 'range' : 'text'"
          v-model.number="c.value.value"
          :min="c.min"
          :max="c.max"
          :step="c.step"
        />
        &nbsp;
        <button-medium
          v-if="!hasSubmit && c.control === 'text'"
          @click="onSubmit(i)"
        >
          Send
        </button-medium>
      </div>
      <button-medium v-if="c.control === 'submit'" @click="onFormSubmit()">
        Send
      </button-medium>
      <div
        v-if="c.labels"
        style="display: flex; justify-content: space-between"
      >
        <div v-for="label in c.labels" :key="label">{{ label }}</div>
      </div>
    </div>
  </div>
</template>
