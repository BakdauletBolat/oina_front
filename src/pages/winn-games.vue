<script setup lang="ts">

import {Icon, Loading} from "vant";
import {useRouter} from "vue-router";
import {useGameStore} from "../stores/game-store.ts";
import GameCard from "../components/GameCard.vue";
import {onMounted} from "vue";

const router = useRouter();
const gameStore = useGameStore();


onMounted(()=>{
  gameStore.loadWinGames()
})


function goBack() {
  router.back();
}

function onClickCard(id: number){
  router.push({
    name: 'game-detail',
    params: {
      gameId:id,
    }
  })
}

</script>

<template>
  <van-nav-bar
      title="Выигранные матчи"
      left-text="Назад"
      left-arrow
      @click-left="goBack"
  />
  <div class="pt-4" v-if="gameStore.isLoadingListGames">
    <loading color="#0094ff" size="24px" text-color="#0094ff" vertical>
      <template #icon>
        <icon name="gem-o" size="30" />
      </template></loading>
  </div>
  <van-grid class="mt-4" :column-num="1" gutter="16">
    <van-grid-item v-for="game in gameStore.winnGames" class="!items-start rounded-lg overflow-hidden">
      <game-card @click="()=>onClickCard(game.id)" :game="game"></game-card>
    </van-grid-item>
  </van-grid>
</template>

<style scoped>

</style>