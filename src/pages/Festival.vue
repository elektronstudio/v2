<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { ETitle, EContent } from "elektro";
import {
  strapiFestivals,
  filterUpcomingEvents,
  filterPastEvents,
  sortOlderFirst,
} from "../lib";

const { params } = toRefs(useRoute());
const festival = computed(() =>
  (strapiFestivals.value || []).find(
    (f) => f.slug === params.value.festival_slug
  )
);
const upcomingEvents = computed(() =>
  festival.value?.events.filter(filterUpcomingEvents)
);
const pastEvents = computed(() =>
  festival.value?.events.filter(filterPastEvents).sort(sortOlderFirst)
);

const imageUrl = computed(() => {
  return festival.value?.images[0]
    ? festival.value.images[0].formats.small.url
    : "";
});
</script>
<template>
  <horizontal
    style="--cols: auto 1fr 1fr; gap: 0"
    :style="{ '--cols': imageUrl ? 'auto 1fr 1fr' : '140px 1fr 1.5fr' }"
  >
    <div style="padding: var(--p-5); border: 1px solid var(--gray-500)">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        style="width: 256px; height: 256px; aspect-ratio: 1; object-fit: cover"
      />
    </div>
    <vertical style="padding: var(--p-5)">
      <ETitle size="lg" v-html="festival?.title" />
      <EContent
        style="letter-spacing: 0.01em"
        v-html="festival?.description_estonian"
      />
      <EContent v-html="festival?.description_english" />
    </vertical>
    <vertical
      style="
        border: 1px solid var(--gray-500);
        padding: var(--p-5);
        transform: translateX(-1px);
      "
    >
      <ETitle style="opacity: 0.5" v-if="upcomingEvents?.length"
        >Upcoming events</ETitle
      >
      <event-card
        v-for="(event, i) in upcomingEvents"
        :key="i"
        :festival="festival"
        :event="event"
        :image="true"
      />
      <ETitle style="opacity: 0.5" v-if="pastEvents?.length"
        >Past events</ETitle
      >
      <event-card
        v-for="(event, i) in pastEvents"
        :key="i"
        :festival="festival"
        :event="event"
        :image="true"
      />
    </vertical>
    <!-- <users /> -->
    <layout>
      <template #top-left>
        <back-button />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <!-- <users-button /> -->
      </template>
    </layout>
  </horizontal>
</template>
