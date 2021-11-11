<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import Playable from "playable";
import HLSAdapter from "playable/dist/src/adapters/hls";

import { stats } from "../lib";
import { whenever } from "@vueuse/core";

const props = defineProps({
  src: { type: String },
  streamkey: { type: String, default: "" },
});

const stat = computed(() => {
  const viewers = stats.value.find(
    (s) => props.streamkey && props.streamkey == s.group
  );
  return viewers?.count;
});

const playableRef = ref(null);

whenever(playableRef, () => {
  Playable.registerPlaybackAdapter(HLSAdapter);
  // const src =
  //   "https://wixmp-e655b44a6e13731b4eedaadd.wixmp.com/Highest%20Peak.mp4";
  const player = Playable.create({
    src: props.src,
    autoplay: true,
    muted: true,
    playsinline: true,
    width: 160 * 3,
    height: 90 * 3,
  });
  player.attachToElement(playableRef.value);
  console.log(props.src);
});
</script>

<template>
  <div>hey</div>
  <div ref="playableRef" autplay muted playsinline />
</template>
