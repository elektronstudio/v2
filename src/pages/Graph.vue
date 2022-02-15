<script setup>
import { ref, computed } from "vue";
import { line } from "d3-shape";
import { scaleTime, scaleLinear, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import { add } from "date-fns";
import { interpolatePlasma } from "d3-scale-chromatic";

const width = 500;
const height = 100;
const p = 5;

const data = ref([
  { value: -2, userId: "a12", datetime: add(new Date(), { seconds: 1 }) },
  { value: 421, userId: "a12", datetime: add(new Date(), { seconds: 10 }) },
  { value: 421, userId: "a12", datetime: add(new Date(), { seconds: 40 }) },
  { value: 1000, userId: "ffa", datetime: add(new Date(), { seconds: 1 }) },
  { value: 212, userId: "ffa", datetime: add(new Date(), { seconds: 10 }) },
  { value: 21, userId: "ffa", datetime: add(new Date(), { seconds: 40 }) },
]);

const xDomain = computed(() => extent(data.value, (d) => new Date(d.datetime)));
const yDomain = computed(() => extent(data.value, (d) => d.value).reverse());
const userIds = computed(() => extent(data.value, (d) => d.userId));

const x = computed(() =>
  scaleTime()
    .domain(xDomain.value)
    .range([p, width - p])
);

const y = computed(() =>
  scaleLinear()
    .domain(yDomain.value)
    .range([p, height - p])
);

const color = (userId) =>
  interpolatePlasma(
    scaleOrdinal().domain(userIds.value).range([0.2, 0.8])(userId)
  );

const d = line()
  .x((d) => x.value(new Date(d.datetime)))
  .y((d) => y.value(d.value));
</script>

<template>
  <div>
    <button @click="addData">Add</button>
    <svg :width="width" :height="height">
      <path
        v-for="userId in userIds"
        :key="userId"
        :d="d(data.filter((f) => f.userId === userId))"
        :stroke="color(userId)"
        stroke-width="2"
        fill="none"
      />
    </svg>
    <pre>{{ data }}</pre>
  </div>
</template>
