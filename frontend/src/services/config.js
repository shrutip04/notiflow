// Shared by the popup (via api.js) and the background service worker.
// Keep this file free of React/DOM imports: the service worker loads it.
const env = import.meta.env || {}

export const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:8080'

// chrome.storage.local keys
export const AUTH_KEY = 'notiflow_auth'               // { token, email, name }
export const CTX_ENABLED_KEY = 'notiflow_ctx_enabled' // boolean, default true
export const CTX_STATE_KEY = 'notiflow_ctx_state'     // tracker working state
export const CTX_STATUS_KEY = 'notiflow_ctx_status'   // { lastSentAt, lastError }