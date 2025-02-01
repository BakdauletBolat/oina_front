<script setup lang="ts">
import {ref} from "vue";
import {useUserStore} from "../stores/user-store.ts";
import {showNotify, showToast} from "vant";
import {useRouter} from "vue-router";

const username = ref('');
const password = ref('');
const isLoading = ref(false);

const userStore = useUserStore();
const router = useRouter();

async function handleSubmit() {
  try {
    isLoading.value = true;
    const response = await userStore.loginWithDjango({
      username: username.value,
      password: password.value,
    });
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
        //@ts-ignore
    if (error?.response?.data) {
      //@ts-ignore
      showNotify(error!.response.data.detail);
    }
  }
  finally {
    isLoading.value = false;
  }
}

</script>

<template>
<main>
  <van-form @submit="handleSubmit" class="pt-4">
    <van-cell-group inset>
      <div class="font-bold mt-4 px-4">
        Авторизация
      </div>
      <p class="text-xs px-4 mt-2">Только организаторы могут создавать турниры. Если вам нужен доступ, обратитесь к администратору для получения прав организатора. ✅</p>
      <van-field
          class="mt-2"
          v-model="username"
          name="Username"
          label="Никнэйм"
          placeholder="Введите имя пользователя"
          :rules="[{ required: true, message: 'Имя пользователя обязательно для заполнения' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="Password"
          label="Пароль"
          placeholder="Введите пароль"
          :rules="[{ required: true, message: 'Пароль обязательны для заполнения' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button :loading="isLoading" round block type="primary" native-type="submit">
        Войти
      </van-button>
    </div>
  </van-form>
</main>
</template>

<style scoped>

</style>