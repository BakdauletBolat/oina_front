<script setup lang="ts">
import {Loading, Icon, showNotify, showToast} from "vant";
import {onMounted, ref} from "vue";
import {useUserStore} from "../stores/user-store.ts";
import {useRouter} from "vue-router";


const isLoading = ref(false);
const userStore = useUserStore();
const haveTokenData = ref(true);
const router = useRouter();

onMounted(async ()=>{
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const tgAuthResult = params.get('tgAuthResult');

  const auth_token = localStorage.getItem('auth_token');

  if (auth_token) {
      haveTokenData.value = true;
      showToast('Вы уже авторизованы, перенаправляем на главный экран...');
      setTimeout(()=>{
          router.push({ name: "home" });
      }, 3000)
      return;
  }

  if (tgAuthResult != null) {
    try {
      isLoading.value = true;
      const response = await userStore.loginWithTelegram(tgAuthResult);
      userStore.saveUserToken(response.data);
      showNotify({
        message: 'Успешная авторизация',
        type: 'success',
      });
      showToast('Перенаправляем на профиль ...');
      userStore.isAuthenticated = true;
      setTimeout(()=>{
        router.push({ name: "selection" });
      }, 3000)

    }
    catch (error) {
      showNotify("")
      //@ts-ignore
      if (error?.response?.data) {
        //@ts-ignore
        showNotify(error!.response.data.detail);
        showToast(error!.response!.data.toString());
        showToast('Перенаправляем на главный экран...');
        setTimeout(()=>{
            router.push({ name: "home" });
        }, 5000)
      }
    }
    finally {
      isLoading.value = false;
    }
  }
  else {
    haveTokenData.value = false;
  }
})


</script>

<template>
<main class="w-full flex justify-center items-center h-screen">
  <div v-if="haveTokenData">
    <loading v-if="isLoading" color="#0094ff" size="24px" text-color="#0094ff" vertical>
      <template #icon>
        <icon name="gem-o" size="30" />
      </template>
      Авторизация...</loading>
  </div>
  <div v-else class="px-4">
    <div class="text-xl text-bold">Похоже, мы не получили ваш токен. Попробуйте еще раз!</div>
  </div>
</main>
</template>

<style scoped>

</style>