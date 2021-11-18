<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { parseStreamkey } from "../lib";

const route = useRoute();
const stream = computed(() => parseStreamkey(route.params.streamkey));
</script>

<template>
  <horizontal style="--cols: 3.5fr 300px; gap: 0">
    <div style="padding: 48px">
      <video-stream
        v-for="(src, i) in stream.streamurls"
        :key="i"
        :src="src"
        :streamkey="stream.streamkeys[i]"
        style="width: 100%"
      />
    </div>
    <div>
      <event-panel
        title="Chat"
        style="background: var(--bglighter); position: sticky; top: 0"
      >
        <chat :channel="stream.streamkeys[0]" />
      </event-panel>
    </div>
    <users />
    <layout>
      <template #top-left>
        <back-button />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </horizontal>
</template>
