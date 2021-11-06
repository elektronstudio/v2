<script setup lang="ts">
import { computed, defineProps } from "vue";
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

const onError = ({ event, data }) => console.log(event, data);
</script>

<template>
  <Player muted autoplay playsinline @vm-error="onError">
    <Hls autoPiP :config="{ config: { maxBufferLength: 60 } }">
      <source :data-src="props.src" type="application/x-mpegURL" />
    </Hls>
    <DefaultUi noControls>
      <Scrim />
      <Controls
        v-if="stat"
        pin="bottomLeft"
        :hideOnMouseLeave="false"
        waitForPlaybackStart
      >
        <icon-eye />
        <smaller>{{ stat }}</smaller>
      </Controls>
      <Controls pin="bottomRight" :activeDuration="1000000000">
        <ControlSpacer />
        <VolumeControl />
        <SettingsControl />
        <PipControl />
        <FullscreenControl />
      </Controls>
    </DefaultUi>
  </Player>
</template>
