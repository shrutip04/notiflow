import api from './api'

export const getNotifications = async () => (await api.get('/api/notifications')).data

// Real endpoint: the backend runs it through the Decision Engine and stores the decision.
export const submitNotification = async ({ source, title, content }) =>
    (await api.post('/api/notifications', { source, title, content })).data