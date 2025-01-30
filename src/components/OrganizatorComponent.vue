<script setup lang="ts">
import {useUserStore} from "../stores/user-store.ts";

const userStore = useUserStore();


</script>

<template>
<div v-if="userStore.user?.role == 'organizer'">
  <slot></slot>
</div>
</template>

<style scoped>

</style>