<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { strapiPrivateEvent } from "../lib";

const route = useRoute();

const event = strapiPrivateEvent(route.params.event_slug);

const streamkeys = computed(() =>
  route.params.streamkey.split(",").map((s) => s.trim())
);

const streamurls = computed(() => streamkeys.value.map(formatStreamUrl));
</script>

<template>
  <horizontal
    :style="{
      '--cols': event && event.chat === false ? '1fr 0' : '3.5fr 350px',
      gap: 0,
    }"
  >
    <div style="padding: 48px">
      <video-stream
        v-for="(src, i) in event.streamurls"
        :key="i"
        :src="src"
        :streamkey="event.streamkeys[i]"
        style="width: 100%"
      />
      <vertical>
        <div style="height: 32px" />
        <h1
          :style="{
            fontSize: '60px',
            lineHeight: '1.2em',
            paddingRight: event && event.chat === false ? '10vw' : '',
          }"
          v-html="event?.title"
        />

        <vertical v-html="event?.description_estonian" />
        <h3 v-if="event?.description_estonian && event?.description_english">
          In English
        </h3>
        <vertical v-html="event?.description_english" />
      </vertical>
    </div>
    <div>
      <event-panel
        v-if="event.chat"
        title="Chat"
        style="background: var(--bglighter); position: sticky; top: 0"
      >
        <chat :channel="route.params.event_slug" />
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
