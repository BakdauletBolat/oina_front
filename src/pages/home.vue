<script setup lang="ts">
import {useGameStore} from "../stores/game-store.ts";
import {onMounted} from "vue";
import GameCard from "../components/GameCard.vue";
import {useRouter} from "vue-router";
import {Icon, Loading} from "vant";

const gameStore = useGameStore();
const router = useRouter();

onMounted(()=>{
  gameStore.loadGames();
})

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
  <main>
    <div class="text font-bold px-4 pt-4">
      Последние матчи
    </div>
    <section class="mt-4">
      <div v-if="gameStore.isLoadingListGames">
        <loading color="#0094ff" size="24px" text-color="#0094ff" vertical>
          <template #icon>
            <icon name="gem-o" size="30" />
          </template>
          Загружаем игры...</loading>
      </div>
      <van-grid :column-num="1" gutter="16">
        <van-grid-item v-for="game in gameStore.games" class="!items-start rounded-lg overflow-hidden">
            <game-card @click="()=>onClickCard(game.id)" :game="game"></game-card>
        </van-grid-item>
      </van-grid>
    </section>
    <div class="h-[100px]"></div>
  </main>
</template>

<style>
.van-grid-item__content {
  padding: 0 !important;
}
</style>