import { defineStore } from 'pinia'
import axiosInstance from '../api/network';
import {getFromCache, setToCache} from "../plugins/cache.ts";


interface LoginResponseInterface {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    email?: string;
    photo_url?: string;
    username: string;
    rating_sum: number;
    last_name?: string,
    first_name?: string,
    winning_sum: number,
    lost_sum: number;
    role: string;
}

interface UsersResponseInterface {
    results: User[];
    next: string | null;
}

export const useUserStore = defineStore('user-store', {
    state: () => {
        return {
            user: null as User | null,
            isLoading: false as boolean,
            isLoadingUsers: false as boolean,
            isAuthenticated: localStorage.getItem('auth_token') !== null,
            isFinished: false,
            users: [] as User[],
            searchText: ''
        }
    },
    getters: {
        bestTreePlayers: (state) => {
            return state.users.slice(0,3)
        },
        otherPlayers: (state) => {
            return state.users.slice(3);
        }
    },
    actions: {
        async loginWithTelegram(tgAuthToken: string) {
            return axiosInstance.post<LoginResponseInterface>(`/users/auth/`, {
                token: tgAuthToken,
                source: 'telegram'
            })
        },
        isGameOwner(ids: number[]) {
            if (this.user) {
                return ids.includes(this.user.id)
            }

            return false;
        },
        isAuthor(authorId: number) {
            return authorId === this.user?.id
        },
        async loadUser() {
            this.isLoading = true;
            if (!this.isAuthenticated) {
                return;
            }
            try {
                const user = getFromCache('auth-user')
                if (user) {
                    this.user = user
                }

                const res = await axiosInstance.get<User>('/users/me/');
                this.user = res.data;
                setToCache('auth-user', res.data);
            }
            finally {
                this.isLoading = false;
            }
        },
        async loadProfile(id: number) {
          return axiosInstance.get<User>(`/users/${id}/`)
        },
        logoutUser() {
          localStorage.removeItem('auth-user');
          localStorage.removeItem('auth_token');
          this.isAuthenticated = false;
        },
        async loadUsers(beginning: boolean) {
            this.isLoadingUsers = true;
            try {
                let lengthNow = this.users.length;
                if (beginning) {
                    lengthNow = 0;
                }
                const res = await axiosInstance.get<UsersResponseInterface>(`/users/?offset=${lengthNow}&search=${this.searchText}`);
                if (res.data.next == null) {
                    this.isFinished = true;
                }
                if (beginning) {
                    this.users = res.data.results;
                    this.isFinished = false;
                    return;
                }
                this.users.push(...res.data.results);
            }
            catch (error) {
                this.isFinished = true;
                console.log(error);
            }
            finally {
                this.isLoadingUsers = false;
            }
        },
        saveUserToken(token_data: LoginResponseInterface) {
            localStorage.setItem('auth_token', token_data.access);
        }
    }
})