<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  episode: { type: Object },
});
</script>

<template>
  <vertical style="gap: 4px">
    <h2 v-html="episode.title" />
  </vertical>
</template>
