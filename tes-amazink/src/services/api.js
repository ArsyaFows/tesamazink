import axios from 'axios'
import { useAuthStore } from '../stores/auth'


const api = axios.create({
  baseURL: "https://dummyjson.com", // ✅ harus ini
})


// attach token if present
api.interceptors.request.use((config) => {
try {
const auth = useAuthStore()
if (auth?.token) {
config.headers.Authorization = `Bearer ${auth.token}`
}
} catch {}
return config
})


// simple error normalization
api.interceptors.response.use(
(res) => res,
(err) => {
const message = err?.response?.data?.message || err.message || 'Request error'
return Promise.reject(new Error(message))
}
)


export default api