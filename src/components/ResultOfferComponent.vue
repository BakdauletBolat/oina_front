<script setup lang="ts">

import {showToast} from "vant";
import {ref} from "vue";
import {useGameStore} from "../stores/game-store.ts";

const stepperValueAuthor = ref<number>(0);
const stepperValueRival = ref<number>(0);
const isLoadingApprove = ref<boolean>(false);

const gameStore = useGameStore();


async function onClickSubmitResultSave(action_type: string = 'offer') {

  if (stepperValueAuthor.value < 0 || stepperValueRival.value < 0) {
    showToast("Счет не может быть меньше нуля !")
    return;
  }

  if (stepperValueAuthor.value == stepperValueRival.value) {
    showToast("Счет не может быть ничьей")
    return;
  }

  isLoadingApprove.value = true;
  try {
    const res = await gameStore.approveResult(gameStore.game!.id, {
      action_type,
      result: {
        game: {
          author_score: stepperValueAuthor.value,
          rival_score: stepperValueRival.value,
        }
      }
    })
    showToast("Успешно отправлено")
    gameStore.toggleResultOffer();
    gameStore.game = res.data;
  }
  catch (error) {
    showToast("При отправке что то не так повторите позднее")
    console.error(error)
  }
  finally {
    isLoadingApprove.value = false;
  }
}
</script>

<template>
  <div>
    <van-action-sheet v-model:show="gameStore.showResultOfferComponent" title="Счет матча">
      <div class="px-4 min-h-[300px]">
        <div class="flex justify-center gap-2">
          <div class="flex flex-col items-center">
            <van-image round width="50px" height="50px" :src="gameStore.game?.author.photo_url"></van-image>
            <van-stepper v-model="stepperValueAuthor" step="1" min="0" input-width="50px" class="text-2xl mt-2"
                         button-size="35px"/>
          </div>
          <div class="flex flex-col items-center">
            <van-image round width="50px" height="50px" :src="gameStore.game?.rival.photo_url"></van-image>
            <van-stepper v-model="stepperValueRival" step="1" min="0" input-width="50px" class="text-2xl mt-2" button-size="35px"/>
          </div>
        </div>
        <div class="mt-4">
          <van-button type="primary" block @click="()=>onClickSubmitResultSave()" :loading="isLoadingApprove">Создать</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style scoped>

</style>