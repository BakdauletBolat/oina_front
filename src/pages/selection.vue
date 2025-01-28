<script setup lang="ts">
import Login from "./login.vue";
import Profile from "./profile.vue";
import {useUserStore} from "../stores/user-store.ts";

const userStore = useUserStore();

</script>

<template>
  <section>
    <login v-if="!userStore.isAuthenticated" />
    <profile v-else />
  </section>
</template>

<style scoped>

</style>