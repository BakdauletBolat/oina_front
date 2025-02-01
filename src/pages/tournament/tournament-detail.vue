<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {useTournamentUserStore} from "../../stores/tournament-user-store.ts";
import {onMounted} from "vue";
import GameCard from "../../components/GameCard.vue";
import FifaLogo from "../../assets/fifa/logo.png";
import {useTournamentOrganizerStore} from "../../stores/tournament-organizer-store.ts";
import {showToast} from "vant";
import {share} from "../../plugins/shareLink.ts";

const router = useRouter();
const route = useRoute();
const tournamentUserStore = useTournamentUserStore();
const tournamentOrganizerStore = useTournamentOrganizerStore();


function goBack(): void {
  router.back();
}

onMounted(() => {
  const id = parseInt(route.params.tournamentId.toString());
  tournamentUserStore.loadTournament(id);
})

function onClickCard(id: number) {
  router.push({
    name: 'game-detail',
    params: {
      gameId: id,
    }
  })
}

async function finishTournament() {
  const id = parseInt(route.params.tournamentId.toString());
  try {
    const tournament = await tournamentOrganizerStore.finishTournament(id);
    tournamentUserStore.tournament!.status = tournament!.status;
    tournamentUserStore.tournament!.end_date = tournament!.end_date;
    tournamentUserStore.tournament!.winner = tournament!.winner;
    tournamentUserStore.tournament!.winner_point = tournament!.winner_point;

    showToast(`Успешно закрыть турнир победитель - ${tournament?.winner.username}`);
  } catch (error) {
    showToast("Ошибка: Невозможно завершить игру - остались несыгранные матчи")
    console.log(error);
  }
}



</script>

<template>
  <main>
    <van-nav-bar
        title="Турнир"
        left-text="Назад"
        left-arrow
        @click-left="goBack"
    >
      <template #right>
        <van-icon name="share" @click="()=>{
          share(`/tournament/${tournamentUserStore.tournament!.id}`,'Поделиться турниром')
        }"></van-icon>
      </template>
    </van-nav-bar>
    <div v-if="tournamentUserStore.tournament">
      <div class="px-4 my-4">
        <van-image :src="FifaLogo"></van-image>
        <h1 class="text-2xl font-bold"> {{ tournamentUserStore.tournament.name }}</h1>
        <p class="text-sm text-gray-500">Организатор:
          {{ tournamentUserStore.tournament.organizer.first_name ?? tournamentUserStore.tournament.organizer.username }}</p>
        <van-tag v-if="[0,1].includes(tournamentUserStore.tournament.status)">Турнир идет</van-tag>
        <van-tag type="danger" v-if="tournamentUserStore.tournament.status == 2">Турнир окончен</van-tag>
      </div>
      <div class="px-4" v-if="tournamentUserStore.tournament.winner">
        <div class="text-xl font-bold">Победитель турнира</div>
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center my-4 gap-2">
              <van-image round width="70" height="70" fit="cover"
                         :src="tournamentUserStore.tournament.winner!.photo_url"></van-image>
              <div class="font-medium">{{ tournamentUserStore.tournament.winner!.username }}</div>
            </div>
          </div>
          <div class="text-gray-500 flex items-center">
            <div>+{{ tournamentUserStore.tournament.winner_point }} Баллов</div>
            <van-icon name="fire"></van-icon>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto ">
        <table class="min-w-full border-collapse text-sm">
          <thead>
          <tr class="bg-[#07C160] text-white">
            <th class="sticky left-0 bg-[#07C160] px-4 py-2">Игроки</th>
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
        <div class="mt-4 flex flex-col gap-4">
          <div @click="()=>onClickCard(game.id)" v-for="game in tournamentUserStore.tournament.tournament_games"
               class="!items-start w-full px-4 rounded-lg overflow-hidden">
            <div class="font-bold my-2">{{ game.ordering + 1 }} игра</div>
            <div>
              <div class="flex flex-col bg-white border border-gray-100 rounded">
                <game-card @click="()=>onClickCard(game.id)" :game="game"></game-card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4">
        <van-button v-if="tournamentUserStore.tournament.status != 2" type="danger" block :loading="tournamentOrganizerStore.isLoadingFinish" @click="finishTournament">
          Окончить турнир
        </van-button>
      </div>
      <div class="h-[100px]"></div>
    </div>

  </main>
</template>

<style scoped>

</style>