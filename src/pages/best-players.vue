<script setup lang="ts">
import {type User, useUserStore} from "../stores/user-store.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();

function goBack() {
  router.back();
}


function onClickUserCell(user: User) {
  router.push({
    name: "user-profile",
    params: {
      userId: user.id
    }
  })
}

</script>

<template>
  <main>
    <van-nav-bar
        title="Лучшие игроки"
        left-text="Назад"
        left-arrow
        @click-left="goBack"
    />
    <section>
      <div class="grid grid-cols-3 px-4 items-end text-white mt-[70px]">
        <div v-if="userStore.bestTreePlayers.length > 1" class="bg-[#FFFBE8] text-black relative h-[100px] flex justify-center items-center flex-col">
          <div class="absolute -top-[50px]">
            <van-image width="70" height="70" class="border border-white" round :src="userStore.bestTreePlayers[1].photo_url"></van-image>
          </div>
          <div class="text-xs">{{userStore.bestTreePlayers[1].username}}</div>
          <div class="text-bold text-xl">{{userStore.bestTreePlayers[1].rating_sum}}</div>
        </div>
        <div class="bg-[#ED6A0C] relative h-[150px] flex justify-center items-center flex-col" v-if="userStore.bestTreePlayers.length>0">
          <div class="absolute -top-[50px]">
            <van-image width="82" height="82" round :src="userStore.bestTreePlayers[0].photo_url"></van-image>
          </div>
          <div class="text-xs">{{userStore.bestTreePlayers[0].username}}</div>
          <div class="text-bold text-xl">{{userStore.bestTreePlayers[0].rating_sum}}</div>
        </div>
        <div v-if="userStore.bestTreePlayers.length > 2" class="bg-[#FAAB0C] h-[120px] flex relative justify-center items-center flex-col">
          <div class="absolute -top-[50px]">
            <van-image width="70" height="70" round :src="userStore.bestTreePlayers[1].photo_url"></van-image>
          </div>
          <div class="text-xs">{{userStore.bestTreePlayers[2].username}}</div>
          <div class="text-bold text-xl">{{userStore.bestTreePlayers[2].rating_sum}}</div>
        </div>
      </div>
      <van-list
          class="px-4 gap-3 mt-4 flex flex-col"
          error-text="Request failed. Click to reload"
          :loading="userStore.isLoadingUsers"
          :finished="userStore.isFinished"
          loading-text="Загрузка ..."
          finished-text="Это конец списка, больше нет данных."
          @load="userStore.loadUsers"
      >
        <div class="bg-white p-3 px-4 flex gap-[20px] items-center" @click="()=>onClickUserCell(item)" v-for="(item, index) in userStore.otherPlayers" :key="item.id">
          <div class="text-2xl font-bold">{{index+4}}</div>
          <div class="flex gap-[15px] items-center">
            <van-image round width="50" height="50" :src="item.photo_url"/>
            <div>
              <div class="text-sm">{{ item.username }}</div>
              <div class="text-[#969799]">{{item.rating_sum}}</div>
            </div>
          </div>
        </div>
      </van-list>
    </section>
  </main>
</template>

<style scoped>

</style>