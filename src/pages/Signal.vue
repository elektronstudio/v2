<script setup>
import { ref, computed, watchEffect } from "vue";
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
watchEffect(() => console.log(feed.value?.items));
</script>
<template>
  <horizontal
    style="padding: 48px; --cols: auto 1fr 1fr"
    :style="{ '--cols': imageUrl ? 'auto 1fr 1fr' : '1fr 1.75fr' }"
  >
    <div>
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
    </div>
    <vertical>
      <div style="height: 8px" />

      <h1
        style="font-size: 80px; line-height: 1em"
        v-html="festival?.title.replace('.', '<wbr />.')"
      />
      <horizontal
        style="gap: 8px; align-items: center; --cols: 1fr 0 1fr 1fr 1fr"
      >
        <a href="https://elektronsignal.captivate.fm/spotify" target="_blank">
          <icon-spotify style="color: white; width: 42px; height: 42px"
        /></a>
        <div />
        <a href="https://elektronsignal.captivate.fm/apple" target="_blank">
          <icon-applepodcasts style="color: white; width: 32px; height: 32px"
        /></a>
        <a href="hhttps://elektronsignal.captivate.fm/google" target="_blank">
          <icon-googlepodcasts style="color: white; width: 32px; height: 32px"
        /></a>
        <a href="https://elektronsignal.captivate.fm/rssfeed" target="_blank">
          <icon-rss style="color: white; width: 32px; height: 32px" />
        </a>
      </horizontal>
      <div style="height: 8px" />
      <vertical style="opacity: 0.7" v-html="festival?.description_estonian" />
      <vertical style="opacity: 0.7" v-html="festival?.description_english" />
    </vertical>
    <vertical style="gap: 24px">
      <div style="height: 8px" />
      <h3 class="subtitle">Latest episodes</h3>
      <vertical style="gap: 48px">
        <episode-card
          v-for="(episode, i) in feed.items"
          :key="i"
          :episode="episode"
      /></vertical>
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
