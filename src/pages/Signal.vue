<script setup>
import { ref, computed } from "vue";
import Parser from "rss-parser/dist/rss-parser.js";

import { strapiFestivals } from "../lib";

const slug = "signal";

const festival = computed(() =>
  (strapiFestivals.value || []).find((f) => f.slug === slug)
);

const imageUrl = computed(() => {
  return festival.value?.images[0]
    ? festival.value.images[0].formats.small.url
    : "";
});

let feed = ref(null);

const rssUrl =
  "https://api.allorigins.win/get?url=https://elektronsignal.captivate.fm/rssfeed";
let parser = new Parser();

fetch(rssUrl)
  .then((res) => res.json())
  .then((rss) => {
    parser.parseString(rss.contents).then((f) => (feed.value = f));
  });
</script>
<template>
  <horizontal
    style="padding: 48px; --cols: auto 1fr 1fr"
    :style="{ '--cols': imageUrl ? 'auto 1fr 1fr' : '1fr 1.75fr' }"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      style="
        width: 150px;
        height: 150px;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 10000px;
        transform: translate(-25px, 25px) scale(1.5);
      "
    />
    <vertical>
      <div style="height: 8px" />
      <h1 style="font-size: 80px; line-height: 1em" v-html="festival?.title" />
      <vertical v-html="festival?.description_estonian" />
      <vertical v-html="festival?.description_english" />
    </vertical>
    <vertical style="gap: 24px">
      <div style="height: 8px" />
      <h3 class="subtitle">Latest episodes</h3>
      {{ feed }}
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
