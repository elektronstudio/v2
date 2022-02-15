<script setup>
import { line } from "d3-shape";
import { scaleTime, scaleLinear, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import { add } from "date-fns";
import { interpolatePlasma } from "d3-scale-chromatic";

const width = 500;
const height = 100;
const p = 5;

const data = [
  { value: -2, userId: "a12", datetime: add(new Date(), { seconds: 1 }) },
  { value: 421, userId: "a12", datetime: add(new Date(), { seconds: 10 }) },
  { value: 421, userId: "a12", datetime: add(new Date(), { seconds: 40 }) },
  { value: 1000, userId: "ffa", datetime: add(new Date(), { seconds: 1 }) },
  { value: 212, userId: "ffa", datetime: add(new Date(), { seconds: 10 }) },
  { value: 21, userId: "ffa", datetime: add(new Date(), { seconds: 40 }) },
];

const xDomain = extent(data, (d) => new Date(d.datetime));
const yDomain = extent(data, (d) => d.value).reverse();
const userIds = extent(data, (d) => d.userId);

const x = scaleTime()
  .domain(xDomain)
  .range([p, width - p]);

const y = scaleLinear()
  .domain(yDomain)
  .range([p, height - p]);

const color = (userId) =>
  interpolatePlasma(scaleOrdinal().domain(userIds).range([0.2, 0.8])(userId));

const d = line()
  .x((d) => x(new Date(d.datetime)))
  .y((d) => y(d.value));
</script>

<template>
  <div>
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
