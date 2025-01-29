<script setup lang="ts">
import {type User, useUserStore} from "../stores/user-store.ts";
import {onMounted, ref} from "vue";
import {Icon, Loading, showToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {useGameStore} from "../stores/game-store.ts";

const userStore = useUserStore()
const gameStore = useGameStore()
const route = useRoute();
const router = useRouter();
const user = ref<User | null>(null);
const isLoading = ref(false);
const isLoadingCreateGame = ref(false);

onMounted(async ()=>{
  const id = parseInt(route.params.userId.toString());
  isLoading.value = true;

  if (id === userStore.user?.id) {
    await router.push({
      name: "selection"
    });
    return;
  }
  try {
    const res = await userStore.loadProfile(id);
    user.value = res.data;
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }

});

function goBack() {
  router.back();
}

async function createGame() {
  isLoadingCreateGame.value = true;
  try {
    const res = await gameStore.create({
      rival_id: user.value!.id,
      game_type: "FIFA"
    });
    showToast("Успешно создан игра")
    await router.push({
      name: "game-detail",
      params: {
        gameId: res.data.id,
      }
    })
  }
  catch (error) {
    showToast("Что то пошло не так при созданий игры");
  }
  finally {
    isLoadingCreateGame.value = false;
  }
}

</script>

<template>
  <main>
    <van-nav-bar
        v-if="user"
        :title="user.username"
        left-text="Назад"
        left-arrow
        @click-left="goBack"
    />
    <div class="pt-4" v-if="isLoading">
      <loading color="#0094ff" size="24px" text-color="#0094ff" vertical>
        <template #icon>
          <icon name="gem-o" size="30" />
        </template></loading>
    </div>
    <div class="flex px-4 pt-4 gap-2 items-center justify-between" v-if="user">
      <div class="flex items-center gap-2 justify-center">
        <van-image fit="cover" round width="70" height="70" :src="user.photo_url"></van-image>
        <div class="flex flex-col">
          <h2>{{ user.first_name }}</h2>
          <h2 class="text-gray-400">@{{ user.username }}</h2>
        </div>
      </div>
    </div>
    <section class="mt-4" v-if="user">
      <van-cell-group>
        <van-cell title="Мои рейтинг" :value="user.rating_sum"/>
        <van-cell title="Выигранные матчи" :value="user.winning_sum"/>
        <van-cell title="Проигранные матчи" :value="user.lost_sum"/>
      </van-cell-group>
    </section>
    <section class="mt-4 px-4" v-if="user" >
      <van-button @click="createGame" :loading="isLoadingCreateGame"
                  block type="primary" >Записать матч вместе с {{user?.first_name ?? user?.username}}</van-button>
    </section>
  </main>
</template>
<style scoped>

</style>