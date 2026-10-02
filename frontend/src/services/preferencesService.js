import api from './api'

export const getPreferences = async () => (await api.get('/api/preferences')).data
