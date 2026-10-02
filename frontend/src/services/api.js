import axios from 'axios'
import { getItem, removeItem } from './storage'

export const AUTH_KEY = 'notiflow_auth' // { token, email, name }

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
    const auth = await getItem(AUTH_KEY)
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`
    return config
})

// The backend has no custom entry point, so an expired/missing JWT
// may come back as 401 OR 403. Both mean "session over" on protected routes.
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error.response?.status
        const isAuthCall = error.config?.url?.startsWith('/api/auth/')
        if ((status === 401 || status === 403) && !isAuthCall) {
            await removeItem(AUTH_KEY)
            onUnauthorized()
        }
        return Promise.reject(error)
    },
)

// Backend error shape: { timestamp, status, error, message, details[] }
export function errorMessage(error) {
    if (!error.response) return 'Cannot reach the Notiflow backend. Is it running?'
    const data = error.response.data
    if (data?.details?.length) return data.details.join('\n')
    return data?.message || 'Something went wrong.'
}

export default api
