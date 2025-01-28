import axios from 'axios'

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
})


export default instance;