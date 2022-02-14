<script setup>
import * as E from "elektro";
console.log({ ...E });
import {
  loadEvents,
  loadMessages,
  loadPages,
  refreshUser,
  refreshUsers,
  plausible,
  getStrapi,
} from "./lib";

//loadEvents();
//loadPages();
loadMessages();
refreshUser();
refreshUsers();
plausible.enableAutoPageviews();
</script>

<template>
  <div class="App">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
  <e-window-border />
</template>

<style>
.App {
  min-height: 100vh;
}
</style>
