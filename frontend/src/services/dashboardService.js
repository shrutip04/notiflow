import api from './api'

export const getSummary = async () => (await api.get('/api/dashboard/summary')).data
