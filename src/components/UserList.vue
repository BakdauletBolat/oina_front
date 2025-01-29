<script setup lang="ts">

import {type User, useUserStore} from "../stores/user-store.ts";
import {useRouter} from "vue-router";

const userStore = useUserStore();
const router = useRouter();

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


</script>

<template>
  <div>
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
  </div>

</template>

<style scoped>

</style>