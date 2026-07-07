import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { 'Accept-Language': 'ar' },
})

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  res => res.data,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      const { refreshToken, setToken, logout } = useAuthStore.getState()

      if (!refreshToken) {
        logout()
        window.location.href = '/login'
        return Promise.reject(err.response?.data || err.message)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { token } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
        ).then(r => r.data)

        setToken(token)
        processQueue(null, token)
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        logout()
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err.response?.data || err.message)
  },
)

export default api
