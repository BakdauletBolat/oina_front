<script setup lang="ts">
import UserList from "../components/UserList.vue";
import {useRouter} from "vue-router";

const router = useRouter();

function goBack() {
  router.back();
}

</script>

<template>
<main>
  <van-nav-bar
      title="Начать матч"
      left-text="Назад"
      left-arrow
      @click-left="goBack"
  />
  <div class="px-4 py-2 text-sm bg-white">
    Отправьте приглашение игрокам, чтобы записать матч
  </div>
  <section>
    <UserList></UserList>
  </section>
</main>
</template>

<style scoped>

</style>