<script setup lang="ts">
import { autoType } from "d3-dsv";
import { ref, watch } from "vue";
import { debouncedWatch } from "@vueuse/core";
import { createMessage, ws } from "../lib";

const file = `

type: DATA_1
title: Enter some data here!
labels: 🤯,:)
description: Please: enter some data
control: slider
min: 0
max: 5
step: 1
--- 
type: DATA_2
title:  Some other data
control: button
min: 0
step: 0.1
`;

const parse = (config) => {
  return config
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

const controls = parse(file);

watch(
  controls.map((c) => c.value),
  (controlsValues, prevControlsValues) => {
    controlsValues.forEach((controlsValue, i) => {
      if (controlsValue !== prevControlsValues[i]) {
        const c = controls[i];
        const outgoingMessage = createMessage({
          channel: "residence",
          type: c.type,
          value: controlsValue,
        });
        ws.send(outgoingMessage);
      }
    });
  },
  { deep: true }
);

// watch(
//   controls,
//   (controls, prevControls) => {
//     console.log(controls, prevControls);
//     // controls.forEach((control, i) => {
//     //   console.log(control.value + " " + prevControls[i].value);
//     //   // if (controls[i].value != prevControls[i].value) {
//     //   //   console.log(control.value, control.type);
//     //   // }
//     // });
//   },
//   { deep: true }
// );
</script>

<template>
  <div style="padding: 32px; display: grid; gap: 24px">
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
    {{ controls }}
  </div>
</template>
