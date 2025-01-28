<script setup lang="ts">
import {type User, useUserStore} from "../stores/user-store.ts";
import {onMounted, ref} from "vue";
import {useGameStore} from "../stores/game-store.ts";
import {Icon, Loading} from "vant";
import GameCard from "../components/GameCard.vue";
import {useRouter} from "vue-router";

const userStore = useUserStore()
const gameStore = useGameStore();

const showActionSheet = ref(false);

const router = useRouter();

onMounted(()=>{
  userStore.loadUser();
  gameStore.loadMyGames()
});

function onClickPlay() {
  showActionSheet.value = !showActionSheet.value;
}

function onClickUserCell(user: User) {
  router.push({
    name: "user-profile",
    params: {
      userId: user.id
    }
  })
}

function onSearch() {
  userStore.loadUsers(true);
}

const showPopover = ref(false);
const actions = [
  { text: 'Выйти',
    className: "w-full text-nowrap",
    type: 'yes'},
  { text: 'Отмена' },
];
const onSelect = (action: any) => {
  if (action.type === 'yes') {
    userStore.logoutUser();
  }
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
  <main>
    <div class="pt-4" v-if="userStore.isLoading">
      <loading color="#0094ff" size="24px" text-color="#0094ff" vertical>
        <template #icon>
          <icon name="gem-o" size="30" />
        </template></loading>
    </div>
    <div class="flex px-4 pt-4 gap-2 items-center justify-between" v-if="userStore.user">
      <div class="flex items-center gap-2 justify-center">
        <van-image fit="cover" round width="70" height="70" :src="userStore.user.photo_url"></van-image>
        <div class="flex flex-col">
          <h2>{{ userStore.user.first_name }}</h2>
          <h2 class="text-gray-400">@{{ userStore.user.username }}</h2>
        </div>
      </div>
      <div class="mt-2 flex justify-center">
        <van-popover placement="bottom-end" v-model:show="showPopover"
                     :actions="actions" @select="onSelect">
          <template #reference>
            <van-button size="small" block plain type="danger">Выйти</van-button>
          </template>
        </van-popover>
      </div>
    </div>
    <section class="mt-4" v-if="userStore.user">
      <van-cell-group>
        <van-cell title="Мои рейтинг" :value="userStore.user.rating_sum"/>
        <van-cell title="Выигранные матчи" :value="userStore.user.winning_sum"/>
        <van-cell title="Проигранные матчи" :value="userStore.user.lost_sum"/>
      </van-cell-group>
      <div class="px-4 mt-4">
        <van-button plain type="primary" @click="onClickPlay" block>Найдите соперников, чтобы начать матч</van-button>
      </div>
    </section>
    <div class="text font-bold px-4 pt-4">
      Игры в процессе
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
        <van-grid-item v-for="game in gameStore.myGames" class="!items-start rounded-lg overflow-hidden">
          <game-card @click="()=>onClickCard(game.id)" :game="game"></game-card>
        </van-grid-item>
      </van-grid>
    </section>
    <div class="shadow">
      <van-action-sheet v-model:show="showActionSheet" title="Начать матч">
        <div>
          <van-search
              shape="round"
              show-action
              v-model="userStore.searchText"
              placeholder="Найти"
              @search="onSearch"
          >
            <template #action>
              <div @click="onSearch">Результаты</div>
            </template>
          </van-search>

        </div>
        <van-list
            error-text="Request failed. Click to reload"
            :loading="userStore.isLoadingUsers"
            :finished="userStore.isFinished"
            loading-text="Загрузка ..."
            finished-text="Это конец списка, больше нет данных."
            @load="userStore.loadUsers"
        >
          <van-cell @click="()=>onClickUserCell(item)" is-link v-for="item in userStore.users" :key="item.id">
            <template #icon>
              <van-image round width="24" height="24" :src="item.photo_url"/>
            </template>
            <template #title>
              <span class="ml-2">{{ item.username }}</span>
            </template>
            <template #value>
              <div class="flex justify-end items-center gap-2 ml-2">
                  <div>
                    <van-icon name="star" color="#ee0a24"></van-icon>
                  </div>
                  <span>
                  {{ item.rating_sum }}
                </span>
              </div>
            </template>
          </van-cell>
        </van-list>
      </van-action-sheet>
    </div>
    <div class="h-[100px]"></div>
  </main>

</template>
<style scoped>

</style>