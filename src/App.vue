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




const activeTabBar = ref();


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
  <main class="!bg-[#F7F7F7] min-h-screen">
    <section >
      <van-tabbar v-model="activeTabBar" @change="onChange">
        <van-tabbar-item icon="home-o">Главная</van-tabbar-item>
        <van-tabbar-item icon="setting-o">Профиль</van-tabbar-item>
      </van-tabbar>
    </section>
    <RouterView/>
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
