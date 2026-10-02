import api, { AUTH_KEY } from './api'
import { getItem, setItem, removeItem } from './storage'

async function persist(data) {
    const auth = { token: data.token, email: data.email, name: data.name }
    await setItem(AUTH_KEY, auth)
    return auth
}

export const login = async (email, password) =>
    persist((await api.post('/api/auth/login', { email, password })).data)

export const register = async (name, email, password) =>
    persist((await api.post('/api/auth/register', { name, email, password })).data)

export const logout = () => removeItem(AUTH_KEY)
export const getStoredAuth = () => getItem(AUTH_KEY)
