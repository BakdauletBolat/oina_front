<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "./stores/user-store.ts";

const userStore = useUserStore();

const dictionaryRouteFromTab: any = {
  0: 'home',
  1: 'selection'
}

const dictionaryRouteFromParam: any = {
  home: 0,
  selection: 1
}

const router = useRouter();
const route = useRoute();




const activeTabBar = ref(0);


function onChange(index: number) {
  router.push({
    name: dictionaryRouteFromTab[index]
  })
}

watch(()=>route.name, (newVal: any, _) => {
  activeTabBar.value = dictionaryRouteFromParam[newVal]
})

onMounted(async () => {
  await userStore.loadUser();
})

</script>

<template>
  <main >
    <section class="!bg-[#F7F7F7] min-h-screen">
      <RouterView/>
    </section>
    <van-tabbar class="!bg-white z-[100px]" v-model="activeTabBar">
      <van-tabbar-item @click="()=>onChange(0)" :icon="activeTabBar == 0 ? 'wap-home' : 'wap-home-o'">Главная</van-tabbar-item>
      <van-tabbar-item @click="()=>onChange(1)" :icon="activeTabBar == 1 ? 'contact' : 'contact-o'">Профиль</van-tabbar-item>
    </van-tabbar>
  </main>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
