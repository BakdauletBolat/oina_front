import {createRouter, createWebHistory} from 'vue-router'

import SelectionPage from './pages/selection.vue';
import HomePage from './pages/home.vue';
import AuthPage from './pages/auth.vue';
import GameDetail from "./pages/game-detail.vue";
import UserProfile from "./pages/user-profile.vue";

const routes = [
    { path: '/', component: HomePage, name: 'home' },
    { path: '/profile', component: SelectionPage, name: 'selection' },
    { path: '/users/:userId', component: UserProfile, name: 'user-profile' },
    { path: '/game/:gameId', component: GameDetail, name: 'game-detail' },
    { path: '/auth', component: AuthPage, name: 'auth' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// router.beforeEach((to, from, next) => {
//
// })

export default router;