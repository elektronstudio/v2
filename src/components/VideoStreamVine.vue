<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import {
  Player,
  Hls,
  DefaultUi,
  Scrim,
  Controls,
  ControlSpacer,
  MuteControl,
  VolumeControl,
  SettingsControl,
  PipControl,
  FullscreenControl,
} from "@vime/vue-next";
import "@vime/core/themes/default.css";

import { stats } from "../lib";

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

const playerRef = ref(null);

const config = {
  config: {
    manifestLoadingRetryDelay: 3000,
    manifestLoadingMaxRetry: Infinity,
    xhrSetup: (xhr) => {
      xhr.addEventListener("error", (e) => {
        console.log("xhrerror", e);
        if (playerRef.value) {
          playerRef.value.play();
        }
      });
    },
  },
};

const onError = (e) => {
  if (playerRef.value) {
    console.log("error", e);
    playerRef.value.play();
  }
};
</script>

<template>
  <Player muted autoplay playsinline ref="playerRef" @vmError="onError">
    <Hls :config="config" autoPiP>
      <source :data-src="props.src" type="application/x-mpegURL" />
    </Hls>
    <DefaultUi noControls hi>
      <Scrim />
      <Controls v-if="stat" pin="bottomLeft" :hideOnMouseLeave="false">
        <icon-eye />
        <smaller>{{ stat }}</smaller>
      </Controls>
      <Controls pin="bottomRight">
        <ControlSpacer />
        <VolumeControl />
        <SettingsControl />
        <PipControl />
        <FullscreenControl />
      </Controls>
    </DefaultUi>
  </Player>
</template>
