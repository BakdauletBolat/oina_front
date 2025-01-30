<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {useTournamentUserStore} from "../../stores/tournament-user-store.ts";
import {onMounted} from "vue";
import GameCard from "../../components/GameCard.vue";

const router = useRouter();
const route = useRoute();
const tournamentUserStore = useTournamentUserStore()


function goBack(): void {
  router.back();
}

onMounted(() => {
  const id = parseInt(route.params.tournamentId.toString());
  tournamentUserStore.loadTournament(id);
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
    <van-nav-bar
        title="Турнир"
        left-text="Назад"
        left-arrow
        @click-left="goBack"
    />
    <div v-if="tournamentUserStore.tournament">
      <div class=" px-4 my-4">
        <h1 class="text-2xl"> {{ tournamentUserStore.tournament.name }}</h1>
        <p class="text-sm text-gray-500">Организатор: {{tournamentUserStore.tournament.organizer.first_name}}</p>
      </div>
      <div class="overflow-x-auto ">
        <table class="min-w-full border-collapse text-sm">
          <thead>
          <tr class="bg-[#323233] text-white">
            <th class="sticky left-0 bg-[#323233] px-4 py-2">Игроки</th>
            <th class="px-4 py-2 ">О</th>
            <th class="px-4 py-2 ">В</th>
            <th class="px-4 py-2">П</th>
            <th class="px-4 py-2">Н</th>
            <th class="px-4 py-2 ">ЗМ</th>
            <th class="px-4 py-2">ПМ</th>
            <th class="px-4 py-2">РМ</th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="userStat in tournamentUserStore.tournament!.stats">
            <td class="sticky left-0 px-4 py-2 bg-white ">
              <div class="flex items-center gap-2">
                <van-image round width="24" height="24" :src="userStat.user.photo_url"></van-image>
                <div>{{ userStat.user.first_name ?? userStat.user.username }}</div>
              </div>
            </td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.points }}</td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.wins }}</td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.losses }}</td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.draws }}</td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.goals_scored }}</td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.goals_conceded }}</td>
            <td class="px-4 py-2 border-b border-b-gray-200">{{ userStat.diff_goals }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="my-4">
        <div class="px-4">Игры</div>
        <van-grid class="mt-4" :column-num="1" gutter="16">
          <van-grid-item @click="()=>onClickCard(game.id)" v-for="game in tournamentUserStore.tournament.tournament_games" class="!items-start rounded-lg overflow-hidden">
            <div class="flex flex-col">
              <div class="px-4 pt-4">{{game.ordering+1}} игра</div>
              <van-divider></van-divider>
              <game-card @click="()=>onClickCard(game.id)" :game="game"></game-card>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="h-[100px]"></div>
    </div>

  </main>
</template>

<style scoped>

</style>