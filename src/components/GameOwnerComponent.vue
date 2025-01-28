<script setup lang="ts">
import type {Game} from "../stores/game-store.ts";
import {useUserStore} from "../stores/user-store.ts";

const userStore = useUserStore();

defineProps<{
  game: Game
}>()
</script>

<template>
<div v-if="userStore.isGameOwner([game.author.id, game.rival.id])">
  <slot></slot>
</div>
</template>

<style scoped>

</style>