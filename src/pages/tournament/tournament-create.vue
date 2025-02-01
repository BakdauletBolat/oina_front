<script setup lang="ts">
import {type User, useUserStore} from "../../stores/user-store.ts";
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import DefaultImage from '../../assets/default.svg';
import {showToast} from "vant";
import {useTournamentOrganizerStore} from "../../stores/tournament-organizer-store.ts";

const userStore = useUserStore();
const tournamentOrganizerStore = useTournamentOrganizerStore();

const router = useRouter();

let timeout: any = null;

const selectedUsers = ref<User[]>([]);
const tournamentNameRef = ref<string>('');
const showActionSheet = ref<boolean>(false);

function selectUser(selectedUser: User) {
  const index = selectedUsers.value.findIndex((user) => user.id === selectedUser.id);
  if (index != -1) {
    selectedUsers.value.splice(index, 1);
  }
  else {
    selectedUsers.value.push(selectedUser);
  }
}

function isSelectedUser(id: number) {
  const index = selectedUsers.value.findIndex((user) => user.id === id);
  return index != -1;
}

function goBack(): void {
  router.back();
}


watch(() => userStore.searchText, (_) => {
  if (timeout !== null) {
    clearTimeout(timeout!);
  }
  timeout = setTimeout(() => {
    userStore.loadUsers(true)
  }, 300);
});

async function handleCreateTournament() {
  if (tournamentNameRef.value === null || tournamentNameRef.value === "") {
    showToast("Имя турнира не может быть пустым");
    return;
  }
  if (selectedUsers.value.length < 4) {
    showToast("Кол-во игроков должно быть больше чем 3");
    return;
  }
  try {
    const res = await tournamentOrganizerStore.createTournamentOrganizer({
      users_ids: selectedUsers.value.map<number>((user) => user.id),
      name: tournamentNameRef.value
    });
    showToast("Успешно турнир создан");
    await router.push({
      name: "tournament-detail",
      params: {
        tournamentId: res,
      }
    });
  }
  catch (error) {
    console.log(error, 'error');
  }
  finally {}
}

</script>

<template>
  <main>
    <van-nav-bar
        title="Создание турнира"
        left-text="Назад"
        left-arrow
        @click-left="goBack"
    />
    <div>
      <div class="px-4 pt-4">
        <van-field
            class="pt-2"
            v-model="tournamentNameRef"
            name="tournamentName"
            placeholder="Назовите турнир"
        />
      </div>
      <van-divider></van-divider>
      <div class="p-4 bg-white py-4 text-sm" @click="showActionSheet=true">
        {{ selectedUsers.length <= 0 ? 'Выберите игроков' : 'Выбранные игроки'  }}
      </div>
      <div >
        <van-grid :column-num="3">
          <van-grid-item v-for="selectedUser in selectedUsers">
            <template #icon>
              <div class="pt-2">
                <van-image  round fit="cover" width="40" height="40" :src="selectedUser.photo_url ?? DefaultImage"></van-image>
              </div>
            </template>
            <template #text>
             <div class="pb-2 text-xs"> {{selectedUser.first_name ?? selectedUser.username}}</div>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="px-4 mt-4">
        <van-button type="success" :loading="tournamentOrganizerStore.isLoadingCreate" block @click="handleCreateTournament">Создать турнир</van-button>
      </div>
      <van-action-sheet v-model:show="showActionSheet" title="Начать матч">
        <div>
          <van-search
              shape="round"
              :clearable="false"
              v-model="userStore.searchText"
              placeholder="Найти"
          >
            <template #action>
            </template>
          </van-search>
        </div>
        <div class="px-4 font-bold" v-if="selectedUsers.length > 0">Выбранные игроки</div>
        <div class="relative px-4 left-4 flex justify-between items-center h-12">
          <img
              v-for="(user, index) in selectedUsers"
              :key="index"
              :src="user.photo_url ?? DefaultImage"
              class="absolute w-10 h-10 rounded-full border-2 border-white"
              :style="{ left: `${index * 12}px`, zIndex: selectedUsers.length - index }"
              :alt="user.first_name"/>
        </div>
        <van-list
            error-text="Request failed. Click to reload"
            :loading="userStore.isLoadingUsers"
            :finished="userStore.isFinished"
            loading-text="Загрузка ..."
            finished-text="Это конец списка, больше нет данных."
            @load="userStore.loadUsers"
        >
          <div v-if="userStore.isLoading" class="flex items-center justify-center py-4">
            <van-loading></van-loading>
          </div>
          <van-cell @click="()=>selectUser(item)" is-link v-for="item in userStore.users" :key="item.id" :class="{
          '!bg-black !text-white': isSelectedUser(item.id)
        }">
            <template #icon>
              <van-image round width="24" height="24" :src="item.photo_url"/>
            </template>
            <template #title>
              <span class="ml-2">{{ item.first_name ?? item.username }}</span>
            </template>
            <template #value>
              <div class="flex justify-end items-center gap-2 ml-2">
                <span class="text-black" :class="{
                  'text-white': isSelectedUser(item.id)
                }">
                  {{ parseInt(item.rating_sum.toString()) }}
                </span>
                <div>
                  <div v-if="isSelectedUser(item.id)"
                       class="flex justify-center items-center">
                    <van-icon name="checked"></van-icon>
                  </div>
                  <div v-else>
                    <van-icon name="star" color="#ee0a24"></van-icon>
                  </div>
                </div>
              </div>
            </template>
            <template #right-icon>
            </template>
          </van-cell>
        </van-list>
        <div class="h-[70px]"></div>
        <div class="fixed bottom-0 w-full">
          <van-button type="primary" block @click="showActionSheet = false">Добавить игроков</van-button>
        </div>
      </van-action-sheet>
    </div>
  </main>
</template>

<style scoped>

</style>