import {createRouter, createWebHistory} from 'vue-router'

import SelectionPage from './pages/selection.vue';
import HomePage from './pages/home.vue';
import AuthPage from './pages/auth.vue';
import GameDetail from "./pages/game-detail.vue";
import UserProfile from "./pages/user-profile.vue";
import StartGame from "./pages/start-game.vue";
import {useUserStore} from "./stores/user-store.ts";
import BestPlayers from "./pages/best-players.vue";
import LostGames from "./pages/lost-games.vue";
import WinnGames from "./pages/winn-games.vue";

const routes = [
    { path: '/', component: HomePage, name: 'home' },
    { path: '/profile', component: SelectionPage, name: 'selection' },
    { path: '/users/:userId', component: UserProfile, name: 'user-profile' },
    { path: '/game/:gameId', component: GameDetail, name: 'game-detail' },
    { path: '/start-game', component: StartGame, name: 'start-game', meta: { requiresAuth: true }},
    { path: '/best-players', component: BestPlayers, name: 'best-players'},
    { path: '/lost-games', component: LostGames, name: 'lost-games' },
    { path: '/winning-games', component: WinnGames, name: 'winning-games' },
    { path: '/auth', component: AuthPage, name: 'auth' },
]



const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, _) => {
    const userStore = useUserStore();
    if (
        // make sure the user is authenticated
        !userStore.isAuthenticated &&
        // ❗️ Avoid an infinite redirect
        to.name !== 'auth' &&
        to.meta.requiresAuth == true

    ) {
        // redirect the user to the login page
        return { name: 'selection' }
    }
})

export default router;