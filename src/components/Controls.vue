<script setup lang="ts">
import { autoType } from "d3-dsv";
import { ref, watch } from "vue";
import { debouncedWatch } from "@vueuse/core";

const file = `

type: DATA_1
title: Sample data
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
        value: 0,
        min: 0,
        max: chunk.max > chunk.min ? chunk.max : 10,
        step: 1,
        ...chunk,
      };
    });
};

const controls = ref(parse(file));

watch(controls, () => console.log(controls.value), { deep: true });
</script>

<template>
  <div style="padding: 32px; display: grid; gap: 24px">
    <div v-for="(c, i) in controls" :key="i" style="display: grid; gap: 0px">
      <div>{{ c.title }}</div>
      <input
        type="range"
        v-model.number="c.value"
        :min="c.min"
        :max="c.max"
        :step="c.step"
      />
      <div style="opacity: 0.5; font-size: 0.9rem">{{ c.description }}</div>
    </div>
    {{ controls }}
  </div>
</template>
