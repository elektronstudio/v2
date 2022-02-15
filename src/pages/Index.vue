<script setup>
import { computed } from "vue";
import { sortNewerFirst } from "../lib";
import {
  strapiEvents,
  strapiFestivals,
  strapiPages,
  filterUpcomingEvents,
} from "../lib";

const upcomingEvents = computed(() =>
  (strapiEvents.value || []).filter(filterUpcomingEvents).sort(sortNewerFirst)
);
</script>

<template>
  <horizontal style="--cols: auto auto 1fr; gap: 0">
    <vertical
      style="
        padding: var(--p-6);
        justify-content: end;
        border-right: 1px solid var(--gray-500);
      "
    >
      <logo />
      <div style="justify-content: end; justify-self: auto">
        <page-card v-for="(page, i) in strapiPages" :key="i" :page="page" />
      </div>
      <social />
      <div />
    </vertical>
    <vertical
      style="
        padding: var(--p-6);
        border: 1px solid var(--gray-500);
        transform: translateX(-1px);
      "
    >
      <horizontal
        style="--cols: 1fr 1fr; gap: var(--gap-4)"
        v-if="strapiFestivals"
      >
        <festival-card
          v-for="(festival, i) in strapiFestivals"
          :key="i"
          :festival="festival"
        />
      </horizontal>
    </vertical>
    <vertical
      style="
        border: 1px solid var(--gray-500);
        transform: translateX(-2px);
        gap: 24px;
        padding: var(--p-6);
      "
      v-if="upcomingEvents.length"
    >
      <event-card
        v-for="(event, i) in upcomingEvents"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
    </vertical>
    <users />
    <layout>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </horizontal>
</template>
