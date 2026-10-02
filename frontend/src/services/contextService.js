import api from './api'

// 404 means the user has never submitted context -> null, not an error.
export async function getCurrentContext() {
    try {
        return (await api.get('/api/context/current')).data
    } catch (e) {
        if (e.response?.status === 404) return null
        throw e
    }
}
