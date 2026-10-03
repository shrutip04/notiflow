import api from './api'

export const getPreferences = async () => (await api.get('/api/preferences')).data

// PUT requires ALL fields (id is ignored). Work hours are passed through exactly as received.
export async function updatePreferences(p) {
    const body = {
        focusModeEnabled: p.focusModeEnabled,
        workHoursStart: p.workHoursStart,
        workHoursEnd: p.workHoursEnd,
        allowHighPriority: p.allowHighPriority,
        allowWorkNotifications: p.allowWorkNotifications,
        allowPersonalNotifications: p.allowPersonalNotifications,
    }
    return (await api.put('/api/preferences', body)).data
}