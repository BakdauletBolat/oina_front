<script setup lang="ts">
import {useGameStore} from "../stores/game-store.ts";
import {onMounted} from "vue";
import GameCard from "../components/GameCard.vue";
import {useRouter} from "vue-router";
import {Icon, Loading} from "vant";

const gameStore = useGameStore();
const router = useRouter();

onMounted(()=>{
  gameStore.loadFinishedGames();
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
    <header class="text-2xl font-bold px-4 pt-[30px]">
      Собери друзей и узнай, <br>
      кто лучший в FIFA!
    </header>
    <section class="actions">
      <div class="grid grid-cols-3 gap-2 px-4 mt-5">
        <router-link :to="{
          name: 'best-players'
        }" class="flex bg-white p-2 flex-col items-center justify-center border border-gray-100 rounded">
          <van-icon name="fire" color="#ED6A0C" size="28"></van-icon>
          <p class="text-xs mt-2 text-center text-nowrap">Лучшие игроки</p>
        </router-link>
        <router-link :to="{
          name: 'start-game',
        }" class="flex bg-white p-4 flex-col items-center justify-center border border-gray-100 rounded">
          <van-icon name="add" color="#36CFC9" size="28"></van-icon>
          <p class="text-xs mt-2  text-center text-nowrap">Начать матч</p>
        </router-link>
        <div class="flex bg-white p-4 flex-col items-center justify-center border border-gray-100 rounded">
          <van-icon name="award" color="#07C160" size="28"></van-icon>
          <p class="text-xs mt-2  text-center text-nowrap">Турниры</p>
        </div>
      </div>
    </section>
    <section class="section" v-if="gameStore.games.length > 0">
      <div class="text font-bold px-4 pt-4" >
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
    </section>
    <section class="px-4 mt-4" v-else>
      <div>Здесь пока ничего нет. Будьте первым, кто создаст запись!</div>
    </section>
    <div class="h-[100px]"></div>
  </main>
</template>

<style>
.van-grid-item__content {
  padding: 0 !important;
}
</style>