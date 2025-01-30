import axios from 'axios'
import {useUserStore} from "../stores/user-store.ts";

const apiUrl = import.meta.env.VITE_APP_API_URL

console.log(import.meta.env)

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

instance.interceptors.request.use(config=>{
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`
    }
    return config;
}, error => {
    const userStore = useUserStore();
    userStore.logoutUser();
    return Promise.reject(error);
})

instance.interceptors.response.use(response=>{

    return response;
}, error => {

    if (error.status === 403 || error.status === 401) {
        const userStore = useUserStore();
        userStore.logoutUser();
        return Promise.reject(error);
    }
    return Promise.reject(error)
})


export default instance;