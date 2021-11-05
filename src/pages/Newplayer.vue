<script setup lang="ts">
import { Player, Hls, DefaultUi } from "@vime/vue-next";
import "@vime/core/themes/default.css";
const src =
  "https://le21.babahhcdn.com/bb1150-le/x_live_1_c1.smil/playlist.m3u8";
</script>

<template>
  <Player>
    <Hls>
      <source :data-src="src" type="application/x-mpegURL" />
    </Hls>
    <DefaultUi></DefaultUi>
  </Player>
</template>
