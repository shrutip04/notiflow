import api from './api'
import { getItem, setItem } from './storage'
import { CTX_ENABLED_KEY, CTX_STATUS_KEY } from './config'

// 404 means the user has never submitted context -> null, not an error.
export async function getCurrentContext() {
    try {
        return (await api.get('/api/context/current')).data
    } catch (e) {
        if (e.response?.status === 404) return null
        throw e
    }
}

// Local extension settings/status written by the background tracker
export async function getSharingEnabled() {
    const v = await getItem(CTX_ENABLED_KEY)
    return v === null ? true : v
}
export const setSharingEnabled = (enabled) => setItem(CTX_ENABLED_KEY, enabled)
export const getTrackerStatus = () => getItem(CTX_STATUS_KEY)