<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useGameStore} from "../stores/game-store.ts";
import {useRoute, useRouter} from "vue-router";
import {formatDateTime} from "../plugins/formateDate.ts";
import KingIconVue from "../assets/king-icon-vue.vue";
import {Icon, Loading, showToast} from "vant";
import {useUserStore} from "../stores/user-store.ts";
import GameOwnerComponent from "../components/GameOwnerComponent.vue";
import ResultOfferComponent from "../components/ResultOfferComponent.vue";

const gameStore = useGameStore();
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const isLoadingFinishGame = ref(false);



onMounted(() => {
  gameStore.loadGame(parseInt(route.params.gameId.toString()));
})


async function finishGame() {
  isLoadingFinishGame.value = true;
  try {
    const res = await gameStore.approveResult(gameStore.game!.id,{
      result: null,
      action_type: 'approve'
    })
    showToast("Матч завершён! Отличная игра!")
    gameStore.game = res.data;
  }
  catch (error) {
    showToast("Произошла ошибка при завершении игры.")
    console.error(error);
  }
  finally {
    isLoadingFinishGame.value = false;
  }

}

function getFormattedTimeByStatus() {
  if (gameStore.game == null) {
    return ''
  }
  if (gameStore.game?.status == 3) {
    return formatDateTime(gameStore.game.finished_at);
  }
  return formatDateTime(gameStore.game.started_at);
}

function getTextStatus() {
  const dict: any = {
    0: "Отправлен запрос на игру",
    1: "Игра идет",
    2: "Ожидаем резултаты",
    3: "Окончен"
  }
  return dict[gameStore.game!.status];
}

function goBack() {
  router.back()
}

function goUserPage(id: number | undefined) {
  router.push({
    name: "user-profile",
    params: {
      userId: id
    }
  })
}

</script>

<template>
 <div>
   <main class="bg-white pb-4">
     <van-nav-bar
         title="Игра"
         left-text="Назад"
         left-arrow
         @click-left="goBack"
     />
     <div v-if="gameStore.isLoadingGame" class="h-screen flex justify-center items-center">
       <loading color="#0094ff" size="24px" text-color="#0094ff" vertical>
         <template #icon>
           <icon name="gem-o" size="30"/>
         </template>
         Загрузка ...
       </loading>
     </div>
     <div v-if="gameStore.game && !gameStore.isLoadingGame">
       <section class="header flex justify-between px-4 pt-4 text-xs">
         <div>
           <span>FIFA</span> <span class="text-gray-600">{{ getFormattedTimeByStatus() }}</span>
         </div>
         <div>
           {{ getTextStatus() }}
         </div>
       </section>
       <section class="result p-4 flex justify-between gap-2">
         <div class="flex items-center gap-8">
           <div @click="()=>goUserPage(gameStore.game?.author.id)" class="flex cursor-pointer items-center flex-col">
             <div class="relative">
               <king-icon-vue v-if="gameStore.game.author.id == gameStore.game.winner?.id"
                              class="absolute w-[40px] h-[40px] -top-[20px] -rotate-[20deg] -left-[5px] z-10"></king-icon-vue>
               <van-image width="70" height="70" fit="cover"
                          round
                          :src="gameStore.game.author.photo_url"></van-image>
             </div>
             <div class="mt-2 text-xs">{{ gameStore.game.author.username }}</div>
           </div>
           <div v-if="gameStore.game.status == 3" class="text-2xl">{{ gameStore.game.result?.game.author_score }}</div>
           <div v-else>-</div>
         </div>
         <div class="flex justify-center items-center">
           <div class="w-[15px] h-[2px] bg-black"></div>
         </div>
         <div class="flex items-center gap-8 justify-end">
           <div v-if="gameStore.game.status == 3" class="text-2xl">{{ gameStore.game.result?.game.rival_score }}</div>
           <div v-else>-</div>
           <div @click="()=>goUserPage(gameStore.game?.rival?.id)" class="flex cursor-pointer items-center justify-end flex-col">
             <div class="relative">
               <king-icon-vue v-if="gameStore.game.rival.id == gameStore.game.winner?.id"
                              class="absolute w-[40px] h-[40px] -top-[20px] -rotate-[20deg] -left-[5px] z-10"></king-icon-vue>
               <van-image width="70" height="70" fit="cover"
                          round
                          :src="gameStore.game.rival.photo_url"></van-image>
             </div>
             <div class="mt-2 text-xs">{{ gameStore.game.rival.username }}</div>
           </div>
         </div>
       </section>
       <game-owner-component class="px-4" :game="gameStore.game" v-if="gameStore.game.status == 1">
         <section v-if="gameStore.game.result == null">
           <van-button @click="gameStore.toggleResultOffer" plain type="primary" block>Создать счёт матча</van-button>
         </section>
       </game-owner-component>
       <game-owner-component class="px-4" :game="gameStore.game" v-if="gameStore.game.status == 0">
         <section v-if="!userStore.isAuthor(gameStore.game.author.id)">
           <van-button @click="gameStore.startGame" :loading="gameStore.isLoadingGameStart" plain type="primary" block>Принять игру</van-button>
         </section>
       </game-owner-component>

       <section v-if="gameStore.game.status != 3" class="mt-4 px-4">
         <div class="text-sm" v-if="gameStore.game.result?.offered_user_id != null">
           {{gameStore.getOfferedUser()!.username}} предложил счёт: Хозяева {{gameStore.game.result.game.author_score}} – {{gameStore.game.result.game.rival_score}} Гости.
         </div>
         <div class="text-xs mt-2 text-gray-500" v-if="gameStore.isOfferedUser(userStore.user?.id)">
           Ваш счёт отправлен. Ждём, пока соперник его подтвердит.
         </div>
       </section>
       <game-owner-component v-if="gameStore.game.status == 2 && gameStore.isApproveUser(userStore.user?.id)"
                             class="px-4 mt-4" :game="gameStore.game" >
         <van-button @click="finishGame" :loading="isLoadingFinishGame" type="primary" block>Подтвердить счет</van-button>
         <div class="flex items-center justify-center gap-2 mt-4">
           <van-button size="small" @click="gameStore.toggleResultOffer">Предложить свой вариант</van-button>
           <van-popover>
             <div class="p-1 text-xs">Не нашли подходящий вариант? Укажите свой.</div>
             <template #reference>
               <van-icon name="question"></van-icon>
             </template>
           </van-popover>
         </div>
       </game-owner-component>
       <result-offer-component></result-offer-component>
     </div>
   </main>
   <van-cell-group class="mt-2" v-if="gameStore.game != null">
     <van-cell v-for="item in gameStore.game.ratings" :key="item.created_at.toString()">
       <template #title>
         <span class="text-nowrap" v-if="item.point > 0"><span class="font-bold">{{ item.user.username }}</span> поднял свой рейтинг</span>
         <span class="text-nowrap" v-else><span class="font-bold">{{ item.user.username }}</span> опустился в рейтинге</span>
       </template>
       <template #value>
         <div class="flex justify-end items-center gap-2 ml-2">
           <span>
                  {{ item.point }}
           </span>
           <div>
             <van-icon v-if="item.point > 0" name="fire" color="#ee0a24"></van-icon>
             <van-icon v-else name="clear" color="#ee0a24"></van-icon>
           </div>

         </div>
       </template>
     </van-cell>
   </van-cell-group>
 </div>
</template>

<style scoped>

</style>