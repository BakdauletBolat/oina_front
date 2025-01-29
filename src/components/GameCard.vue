<script setup lang="ts">
import type {Game} from "../stores/game-store.ts";
import {formatDateTime} from "../plugins/formateDate.ts";

defineProps<{
  game: Game
}>()

function getTextByStatusGame(status: number): string {
  const dict: any = {
    0: "В ожиданий",
    1: "Игра начался",
    2: "Ожидаем результаты",
    3: "Окончен"
  }
  return dict[status];
}

function getColorByStatusGame(status: number) {
  const dict: any = {
    0: "#646566",
    1: "#07C160",
    2: "#FAAB0C",
    3: "#1989FA"
  }
  return dict[status];
}

</script>

<template>
  <div class="grid grid-cols-[6fr_3fr] w-full gap-2 justify-between p-4">
    <div class="flex w-full flex-col">
      <div class="top flex text-sm justify-between" :class="{
                'text-[#969799]': game.loser?.username == game.author.username
              }">
        <div class="flex gap-4 items-center">
          <van-image round width="25" height="25"
                     :src="game.author.photo_url"></van-image>
          <div>{{ game.author.first_name ?? game.author.username }}</div>
        </div>
        <div v-if="game.status == 3">{{ game.result?.game.author_score }}</div>
      </div>
      <div class="bottom text-sm flex justify-between mt-[17px]">
        <div class="flex gap-4 items-center" :class="{
                'text-[#969799]': game.loser?.username == game.rival.username
              }">
          <van-image round width="25" height="25"
                     :src="game.rival.photo_url"></van-image>
          <div>{{ game.rival.first_name ?? game.rival.username }}</div>
        </div>
        <div v-if="game.status == 3">{{ game.result?.game.rival_score }}</div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center px-2" v-if="[0,1,2,3].includes(game.status)">
      <div class="text-sm text-nowrap">
        <van-tag size="medium" :color="getColorByStatusGame(game.status)">{{ getTextByStatusGame(game.status) }}</van-tag>
      </div>
      <div class="text-xs mt-2 text-nowrap text-[#969799] text-center">{{ formatDateTime(game.created_at!) }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>