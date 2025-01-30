<script setup lang="ts">
import {useTournamentUserStore} from "../../stores/tournament-user-store.ts";
import FifaLogo from '../../assets/fifa/logo.png';
import {useRouter} from "vue-router";

const tournamentUserStore = useTournamentUserStore()
const router = useRouter();

</script>

<template>
<main>
  <header class="text-2xl font-bold px-4 pt-[30px]">
    Турниры
  </header>
  <div class="mt-4 px-4">
    <van-button @click="()=>{
      router.push({
      name: 'tournament-create',
      })
    }" type="primary" block>
      Создать турнир
    </van-button>
  </div>
  <div class="mt-4">
    <van-list
    error-text="Request failed. Click to reload"
    :loading="tournamentUserStore.isLoadingList"
    :finished="tournamentUserStore.isFinished"
    loading-text="Загрузка ..."
    finished-text="Это конец списка, больше нет данных."
    @load="tournamentUserStore.loadTournamentList"
    >
    <van-cell @click="()=>{
      router.push({
      name: 'tournament-detail',
      params: {
        tournamentId: item.id
      }
      })
    }" is-link v-for="item in tournamentUserStore.tournaments?.results" :key="item.id">
      <template #title>
        <div class="text-sm">
          <div class="font-bold">#{{item.name}}</div>
          <div class="text-nowrap text-xs text-gray-500">Создатель: {{item.organizer.first_name}}</div>
        </div>
      </template>
      <template #value>
        {{item.game_type}}
      </template>
      <template #icon>
        <van-image fit="contain" width="70" :src="FifaLogo" class="mr-2"></van-image>
      </template>
    </van-cell>
    </van-list>
  </div>
</main>
</template>

<style scoped>

</style>