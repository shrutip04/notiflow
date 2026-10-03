import api from './api'

export const getDecisions = async () => (await api.get('/api/decisions')).data